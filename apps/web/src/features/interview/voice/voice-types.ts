/**
 * Voice turn domain types (Phase 3C).
 * Browser-safe: no Node APIs, no framework imports.
 */

export type VoiceState =
  | 'IDLE'
  | 'RECORDING'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'PLAYING_RESPONSE'
  | 'READY_FOR_NEXT'
  | 'ERROR';

export type VoiceTurnAction = 'CONTINUE' | 'END';

export interface VoiceTurnResponse {
  turnId: string;
  replay: boolean;
  questionId: string;
  questionOrder: number;
  transcript: string;
  responseText: string;
  action: VoiceTurnAction;
  nextQuestionId: string | null;
  /**
   * Server-synthesized response audio (Phase 3D, local Piper sidecar).
   * Optional for backward compatibility; absent when TTS is unavailable
   * (text fallback applies).
   */
  audio?: { mimeType: string; base64: string; voice: string } | null;
  /** Machine-readable TTS outcome from the backend. */
  tts?: { available: boolean; code: string | null; message: string | null } | null;
  /** Phase 4A: this turn answers a previously asked follow-up. */
  followUp?: boolean;
  /** Phase 4A: this turn's response asks a follow-up (post backend cap). */
  followUpAsked?: boolean;
}

/** Machine-readable backend codes surfaced to voice UI copy. */
export const VOICE_ERROR_COPY: Record<string, string> = {
  INVALID_SESSION_STATE: 'This interview is not active. Please start or resume it first.',
  UNSUPPORTED_AUDIO: 'That recording could not be used. Please try recording again.',
  AUDIO_TOO_LARGE: 'The recording is too large. Please record a shorter response.',
  STT_UNAVAILABLE: 'Speech recognition is currently unavailable. Please try again later.',
  STT_TIMEOUT: 'Speech recognition timed out. Please try a shorter response.',
  STT_MODEL_NOT_FOUND: 'Speech recognition is not ready. Please try again later.',
  MALFORMED_TRANSCRIPTION: 'The transcription came back unreadable. Please try again.',
  INVALID_UPLOAD: 'The audio upload failed. Please try recording again.',
  SELECTION_CONFLICT: 'This interview already has questions from an earlier attempt.',
  INSUFFICIENT_QUESTION_POOL: 'Not enough questions are available for this interview configuration.',
  VOICE_TURN_TIMEOUT: 'The voice turn took too long to process. Please try a shorter answer.',
};

export class VoiceTurnError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'VoiceTurnError';
    this.code = code;
    this.status = status;
  }
}

/** Preferred recording MIME types, first supported wins. */
export const PREFERRED_RECORDING_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
] as const;

export function pickRecordingMimeType(
  isTypeSupported?: (mimeType: string) => boolean,
): string | null {
  if (typeof isTypeSupported !== 'function') return null;
  for (const mimeType of PREFERRED_RECORDING_MIME_TYPES) {
    try {
      if (isTypeSupported(mimeType)) return mimeType;
    } catch {
      continue;
    }
  }
  return null;
}

export function isVoiceSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as unknown as { MediaRecorder?: unknown }).MediaRecorder === 'function' &&
    !!navigator.mediaDevices?.getUserMedia
  );
}
