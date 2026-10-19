import { useCallback, useEffect, useRef, useState } from 'react';
import { voiceTurnApi } from './voice-turn.api';
import { ServerAudioPlayer, getTTSProvider, TTSProvider } from './tts';
import {
  VoiceState,
  VoiceTurnError,
  VoiceTurnResponse,
  isVoiceSupported,
  pickRecordingMimeType,
} from './voice-types';

export interface UseVoiceTurnOptions {
  sessionId: string;
  ttsProvider?: TTSProvider;
  onTurnResolved?: (result: { questionId: string; transcript: string }) => void;
}

export interface VoiceTurnMachine {
  status: VoiceState;
  error: string | null;
  errorCode: string | null;
  turn: VoiceTurnResponse | null;
  turnId: string | null;
  recordingMs: number;
  ttsAvailable: boolean;
  startRecording: () => Promise<void>;
  stopAndSubmit: () => Promise<void>;
  retry: () => Promise<void>;
  resetForNextQuestion: () => void;
  playResponse: () => Promise<void>;
  stopPlayback: () => void;
}

interface RecorderHandle {
  recorder: MediaRecorder;
  stream: MediaStream;
  chunks: Blob[];
  mimeType: string;
}

function releaseStream(stream: MediaStream | null) {
  try {
    stream?.getTracks().forEach((track) => track.stop());
  } catch {
    // Cleanup must never break the interview.
  }
}

/**
 * Explicit voice-turn state machine.
 * One logical turn = one stable turnId = at most one in-flight submission.
 * Retries reuse the same turnId so the backend replay path deduplicates.
 */
export function useVoiceTurn(options: UseVoiceTurnOptions): VoiceTurnMachine {
  const { sessionId, onTurnResolved } = options;
  const [status, setStatus] = useState<VoiceState>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [turn, setTurn] = useState<VoiceTurnResponse | null>(null);
  const [turnId, setTurnId] = useState<string | null>(null);
  const [recordingMs, setRecordingMs] = useState(0);
  const [ttsProvider] = useState<TTSProvider>(() => options.ttsProvider ?? getTTSProvider());
  const [serverAudio] = useState(() => new ServerAudioPlayer());

  const handleRef = useRef<RecorderHandle | null>(null);
  const inFlightRef = useRef<Promise<VoiceTurnResponse> | null>(null);
  const lastBlobRef = useRef<{ blob: Blob; turnId: string } | null>(null);
  const statusRef = useRef<VoiceState>('IDLE');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** TurnIds already auto-played: retries/replays of the same turn stay silent. */
  const playedAudioTurnRef = useRef<string | null>(null);

  const setStatusBoth = useCallback((next: VoiceState) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const fail = useCallback(
    (err: unknown, fallback: string) => {
      const message = err instanceof Error && err.message ? err.message : fallback;
      const code = err instanceof VoiceTurnError ? err.code : null;
      setError(message);
      setErrorCode(code);
      setStatusBoth('ERROR');
    },
    [setStatusBoth],
  );

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const submitBlob = useCallback(
    async (blob: Blob, stableTurnId: string): Promise<VoiceTurnResponse> => {
      if (inFlightRef.current) return inFlightRef.current;
      const pending = (async () => {
        setStatusBoth('UPLOADING');
        const result = await voiceTurnApi.submitTurn(sessionId, { audio: blob, turnId: stableTurnId });
        setStatusBoth('PROCESSING');
        return result;
      })();
      inFlightRef.current = pending;
      try {
        return await pending;
      } finally {
        inFlightRef.current = null;
      }
    },
    [sessionId, setStatusBoth],
  );

  const stopServerAudio = useCallback(() => {
    serverAudio.stop();
  }, [serverAudio]);

  const finishTurn = useCallback(
    async (result: VoiceTurnResponse) => {
      setTurn(result);
      onTurnResolved?.({ questionId: result.questionId, transcript: result.transcript });
      // Never overlap a previous response.
      stopServerAudio();
      const serverAudioBase64 = result.audio?.base64;
      if (serverAudioBase64 && playedAudioTurnRef.current !== result.turnId) {
        // Claim before playing so a retry racing this turn cannot double-play.
        playedAudioTurnRef.current = result.turnId;
        setStatusBoth('PLAYING_RESPONSE');
        const started = await serverAudio.play(serverAudioBase64, () => {
          if (statusRef.current === 'PLAYING_RESPONSE') setStatusBoth('READY_FOR_NEXT');
        });
        if (started) return;
        // Browser refused server audio: unclaim and fall through to speech/text.
        playedAudioTurnRef.current = null;
      }
      if (playedAudioTurnRef.current === result.turnId) {
        // Same-turn retry already heard: stay ready, keep the text visible.
        setStatusBoth('READY_FOR_NEXT');
        return;
      }
      if (!ttsProvider.isSupported()) {
        setStatusBoth('READY_FOR_NEXT');
        return;
      }
      playedAudioTurnRef.current = result.turnId;
      setStatusBoth('PLAYING_RESPONSE');
      try {
        await ttsProvider.speak(result.responseText);
      } catch {
        // Playback failure never fails the turn; text remains visible.
      }
      if (statusRef.current === 'PLAYING_RESPONSE') setStatusBoth('READY_FOR_NEXT');
    },
    [onTurnResolved, serverAudio, setStatusBoth, stopServerAudio, ttsProvider],
  );

  const startRecording = useCallback(async () => {
    if (!['IDLE', 'READY_FOR_NEXT', 'ERROR'].includes(statusRef.current)) return;
    // A new recording must never overlap response playback.
    stopServerAudio();
    if (!isVoiceSupported()) {
      fail(new Error('Voice recording is not supported in this browser.'), 'Voice recording is not supported in this browser.');
      return;
    }
    setError(null);
    setErrorCode(null);
    setTurn(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickRecordingMimeType(
        typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function'
          ? MediaRecorder.isTypeSupported.bind(MediaRecorder)
          : undefined,
      );
      if (!mimeType) {
        releaseStream(stream);
        fail(new Error('No supported audio recording format found.'), 'No supported audio recording format found.');
        return;
      }
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) chunks.push(event.data);
      };
      const freshTurnId = crypto.randomUUID();
      setTurnId(freshTurnId);
      handleRef.current = { recorder, stream, chunks, mimeType };
      const startedAt = Date.now();
      setRecordingMs(0);
      timerRef.current = setInterval(() => setRecordingMs(Date.now() - startedAt), 250);
      recorder.start(250);
      setStatusBoth('RECORDING');
    } catch (err) {
      fail(err instanceof DOMException && err.name === 'NotAllowedError'
        ? new Error('Microphone access was denied. Please allow microphone access and try again.')
        : err, 'Could not start recording. Please check your microphone.');
    }
  }, [fail, setStatusBoth, stopServerAudio]);

  const stopAndSubmit = useCallback(async () => {
    const handle = handleRef.current;
    if (statusRef.current !== 'RECORDING' || !handle) return;
    handleRef.current = null;
    stopTimer();
    setRecordingMs(0);
    const stopped = new Promise<Blob>((resolve) => {
      handle.recorder.onstop = () => {
        resolve(new Blob(handle.chunks, { type: handle.mimeType }));
      };
      try {
        handle.recorder.stop();
      } catch {
        resolve(new Blob(handle.chunks, { type: handle.mimeType }));
      }
    });
    const blob = await stopped;
    releaseStream(handle.stream);
    if (blob.size === 0) {
      fail(new Error('The recording was empty. Please try speaking again.'), 'The recording was empty. Please try speaking again.');
      return;
    }
    const activeTurnId = turnId;
    if (!activeTurnId) {
      fail(new Error('Missing turn identifier.'), 'Missing turn identifier.');
      return;
    }
    lastBlobRef.current = { blob, turnId: activeTurnId };
    try {
      const result = await submitBlob(blob, activeTurnId);
      await finishTurn(result);
    } catch (err) {
      fail(err, 'Voice turn failed. Please try again.');
    }
  }, [fail, finishTurn, setStatusBoth, stopTimer, submitBlob, turnId]);

  const retry = useCallback(async () => {
    const last = lastBlobRef.current;
    if (!last || statusRef.current !== 'ERROR') return;
    setError(null);
    setErrorCode(null);
    try {
      const result = await submitBlob(last.blob, last.turnId);
      await finishTurn(result);
    } catch (err) {
      fail(err, 'Voice turn failed. Please try again.');
    }
  }, [fail, finishTurn, setStatusBoth, submitBlob]);

  const resetForNextQuestion = useCallback(() => {
    ttsProvider.stop();
    stopServerAudio();
    setTurn(null);
    setTurnId(null);
    setError(null);
    setErrorCode(null);
    lastBlobRef.current = null;
    setStatusBoth('IDLE');
  }, [serverAudio, setStatusBoth, stopServerAudio, ttsProvider]);

  const playResponse = useCallback(async () => {
    if (!turn || statusRef.current === 'PLAYING_RESPONSE') return;
    // Explicit user replay: stop anything playing, then play this turn.
    stopServerAudio();
    const serverAudioBase64 = turn.audio?.base64;
    if (serverAudioBase64) {
      setStatusBoth('PLAYING_RESPONSE');
      await serverAudio.play(serverAudioBase64, () => {
        if (statusRef.current === 'PLAYING_RESPONSE') setStatusBoth('READY_FOR_NEXT');
      });
      return;
    }
    if (!ttsProvider.isSupported()) return;
    setStatusBoth('PLAYING_RESPONSE');
    try {
      await ttsProvider.speak(turn.responseText);
    } catch {
      // Text remains visible regardless.
    }
    if ((statusRef.current as VoiceState) === 'PLAYING_RESPONSE') setStatusBoth('READY_FOR_NEXT');
  }, [serverAudio, setStatusBoth, stopServerAudio, ttsProvider, turn]);

  const stopPlayback = useCallback(() => {
    ttsProvider.stop();
    stopServerAudio();
    if (statusRef.current === 'PLAYING_RESPONSE') setStatusBoth('READY_FOR_NEXT');
  }, [setStatusBoth, stopServerAudio, ttsProvider]);

  useEffect(() => {
    return () => {
      stopTimer();
      stopServerAudio();
      const handle = handleRef.current;
      handleRef.current = null;
      try {
        if (handle && handle.recorder.state !== 'inactive') handle.recorder.stop();
      } catch {
        // Ignore teardown races.
      }
      releaseStream(handle?.stream ?? null);
      inFlightRef.current = null;
    };
  }, [stopServerAudio, stopTimer]);

  return {
    status,
    error,
    errorCode,
    turn,
    turnId,
    recordingMs,
    ttsAvailable: Boolean(turn?.audio?.base64) || ttsProvider.isSupported(),
    startRecording,
    stopAndSubmit,
    retry,
    resetForNextQuestion,
    playResponse,
    stopPlayback,
  };
}
