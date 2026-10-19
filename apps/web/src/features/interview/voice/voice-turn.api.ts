import { apiClient } from '@/lib/api/api.client';
import { VoiceTurnError, VoiceTurnResponse, VOICE_ERROR_COPY } from './voice-types';

export interface SubmitVoiceTurnInput {
  audio: Blob;
  turnId: string;
  language?: string;
}

function toVoiceTurnError(status: number | undefined, data: unknown, rawError?: unknown): VoiceTurnError {
  const body = (data ?? {}) as { code?: string; message?: string };
  const rawMessage = rawError instanceof Error ? rawError.message : '';
  const timedOut =
    (rawError as { code?: string } | undefined)?.code === 'ECONNABORTED' || /timeout of \d+ms exceeded/i.test(rawMessage);
  const code = timedOut ? 'VOICE_TURN_TIMEOUT' : typeof body.code === 'string' ? body.code : 'VOICE_TURN_FAILED';
  const fallbackMessage = timedOut
    ? 'The voice turn took too long to process. Please try a shorter answer.'
    : 'Voice turn failed. Please try again.';
  const message =
    VOICE_ERROR_COPY[code] ??
    (typeof body.message === 'string' && body.message.length > 0 ? body.message : fallbackMessage);
  return new VoiceTurnError(code, message, status ?? 0);
}

/**
 * Typed client for POST /api/v1/interviews/:sessionId/voice/turn.
 * Sends one recorded blob per logical turn; the caller owns turnId stability
 * across retries (see useVoiceTurn).
 */
export const voiceTurnApi = {
  async submitTurn(sessionId: string, input: SubmitVoiceTurnInput): Promise<VoiceTurnResponse> {
    const form = new FormData();
    form.append('audio', input.audio, 'turn.webm');
    form.append('turnId', input.turnId);
    if (input.language) form.append('language', input.language);
    try {
      // Match the existing upload convention (see resume.service): per-request
      // multipart content type; the browser supplies the boundary.
      // Generous timeout: a real turn spans STT (up to 120s) + Ollama (up to
      // 120s) + TTS. The client's 30s global default would abort real turns.
      const res = await apiClient.post(`/interviews/${sessionId}/voice/turn`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      });
      return res.data?.data as VoiceTurnResponse;
    } catch (error) {
      const response = (error as { response?: { status?: number; data?: unknown } }).response;
      throw toVoiceTurnError(response?.status, response?.data, error);
    }
  },
};
