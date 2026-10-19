"use client";

import { useRuntimeStore } from '../runtime/store/runtime-store';
import { runtimeService } from '../runtime/services/runtime.service';
import { useVoiceTurn } from './use-voice-turn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, Square, Play, OctagonX, RotateCcw, ArrowRight, Volume2, VolumeX, Loader2 } from 'lucide-react';

const STATUS_COPY: Record<string, string> = {
  IDLE: 'Ready when you are',
  RECORDING: 'Listening…',
  UPLOADING: 'Uploading your response…',
  PROCESSING: 'Understanding your response…',
  PLAYING_RESPONSE: 'Playing interviewer response…',
  READY_FOR_NEXT: 'Turn complete',
  ERROR: 'Something went wrong',
};

function formatMs(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function VoicePanel({ sessionId }: { sessionId: string }) {
  const { state, dispatch } = useRuntimeStore();
  const voice = useVoiceTurn({
    sessionId,
    onTurnResolved: ({ questionId, transcript }) => {
      dispatch({ type: 'UPDATE_ANSWER', payload: { questionId, text: transcript } });
    },
  });

  const currentIndex = state.currentQuestionIndex;
  const currentQuestion = state.questions[currentIndex];

  const handleNextQuestion = () => {
    const nextId = voice.turn?.nextQuestionId;
    if (!nextId) return;
    const index = state.questions.findIndex((q) => q.id === nextId);
    if (index < 0) return;
    dispatch({ type: 'JUMP_TO_QUESTION', payload: index });
    runtimeService.navigateQuestion(state.sessionId, 'JUMP', index).catch(console.error);
    voice.resetForNextQuestion();
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Mic className="size-4 text-red-500" /> Voice Response
          <span className="ml-auto text-xs font-normal text-muted-foreground">{STATUS_COPY[voice.status]}</span>
        </CardTitle>
        <CardDescription>
          {currentQuestion
            ? `Question ${currentIndex + 1} of ${state.questions.length}`
            : 'Loading question…'}
          {voice.status === 'RECORDING' && (
            <span className="ml-2 tabular-nums text-red-500">● {formatMs(voice.recordingMs)}</span>
          )}
          {voice.status === 'IDLE' && (
            <span className="block text-xs mt-1">Your browser will ask for microphone access when you start speaking.</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(voice.status === 'IDLE' || voice.status === 'READY_FOR_NEXT' || voice.status === 'ERROR') && (
            <Button onClick={() => void voice.startRecording()} disabled={!currentQuestion}>
              <Mic className="size-4 mr-2" /> Start speaking
            </Button>
          )}
          {voice.status === 'RECORDING' && (
            <Button variant="destructive" onClick={() => void voice.stopAndSubmit()}>
              <Square className="size-4 mr-2" /> Stop &amp; submit
            </Button>
          )}
          {voice.status === 'ERROR' && (
            <Button variant="outline" onClick={() => void voice.retry()}>
              <RotateCcw className="size-4 mr-2" /> Retry same turn
            </Button>
          )}
          {voice.turn && voice.status === 'READY_FOR_NEXT' && (
            <>
              {voice.ttsAvailable ? (
                <Button variant="outline" onClick={() => void voice.playResponse()}>
                  <Play className="size-4 mr-2" /> Replay response
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <VolumeX className="size-3" /> Audio playback unavailable — read the response below
                </span>
              )}
              <Button variant="outline" onClick={() => void voice.stopPlayback()}>
                <OctagonX className="size-4 mr-2" /> Stop audio
              </Button>
            </>
          )}
          {(voice.status === 'UPLOADING' || voice.status === 'PROCESSING' || voice.status === 'PLAYING_RESPONSE') && (
            <Button variant="outline" disabled>
              <Loader2 className="size-4 mr-2 animate-spin" /> Working…
            </Button>
          )}
        </div>

        {voice.status === 'ERROR' && voice.error && (
          <Alert variant="destructive">
            <AlertTitle>Voice turn failed{voice.errorCode ? ` (${voice.errorCode})` : ''}</AlertTitle>
            <AlertDescription>{voice.error}</AlertDescription>
          </Alert>
        )}

        {voice.turn && (
          <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your transcript</p>
              <p className="text-sm mt-1">{voice.turn.transcript || '(no speech detected)'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Volume2 className="size-3" /> Interviewer
              </p>
              <p className="text-sm mt-1">{voice.turn.responseText}</p>
            </div>
            {voice.turn.action === 'END' ? (
              <p className="text-xs text-muted-foreground">
                The interviewer is wrapping up. Use the existing Finish control below when you are ready.
              </p>
            ) : (
              voice.turn.nextQuestionId && (
                <Button variant="secondary" size="sm" onClick={handleNextQuestion}>
                  Go to next question <ArrowRight className="size-3 ml-1" />
                </Button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
