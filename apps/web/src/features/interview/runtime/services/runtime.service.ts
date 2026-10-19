import { apiClient } from "@/lib/api/api.client";
import { RuntimeQuestion } from "../types/runtime.types";
import { InterviewConfiguration } from "@/services/interview/interview.types";

function toSelectionErrorMessage(err: unknown): string {
  const data = (err as { response?: { data?: { code?: string; message?: string } } })?.response?.data;
  if (data?.code === "INSUFFICIENT_QUESTION_POOL") {
    return "Not enough questions are available for this interview configuration.";
  }
  if (typeof data?.message === "string" && data.message) return data.message;
  return "Question Bank selection failed.";
}

export const runtimeService = {
  async generateQuestions(sessionId: string, config: InterviewConfiguration): Promise<RuntimeQuestion[]> {
    // Question Bank mode: single selection call (backend first-write-wins
    // makes retries safe). Never falls back to legacy generation so real
    // coverage problems stay visible instead of being masked by AI output.
    if (config?.questionSource === "QUESTION_BANK") {
      try {
        const res = await apiClient.post(`/interviews/${sessionId}/select-from-bank`, {});
        const selected = res.data?.data?.questions;
        if (selected?.length > 0) return selected;
      } catch (err) {
        // Reloads mid-interview (or retries after success) hit IN_PROGRESS /
        // replay states: load the already-persisted questions instead of
        // failing. Never fall back to legacy /generate here.
        const existing = await apiClient.get(`/interviews/${sessionId}/questions`).catch(() => null);
        const questions = existing?.data?.data?.questions;
        if (questions?.length > 0) return questions;
        throw new Error(toSelectionErrorMessage(err));
      }
      // Selection succeeded but returned no questions: load via the existing
      // question loader once instead of polling AI generation.
      const qRes = await apiClient.get(`/interviews/${sessionId}/questions`).catch(() => null);
      return qRes?.data?.data?.questions || [];
    }

    try {
      let res = await apiClient.post(`/interviews/${sessionId}/generate`).catch(() => null);
      if (res?.data?.data?.questions?.length > 0) return res!.data.data.questions;
      
      // Poll until questions are generated (up to 30 attempts, 1s each)
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const qRes = await apiClient.get(`/interviews/${sessionId}/questions`).catch(() => null);
        if (qRes?.data?.data?.questions?.length > 0) {
          return qRes!.data.data.questions;
        }
      }
      return [];
    } catch {
      const res = await apiClient.get(`/interviews/${sessionId}/questions`);
      return res.data?.data?.questions || [];
    }
  },

  async startSession(sessionId: string): Promise<boolean> {
    await apiClient.post(`/interviews/${sessionId}/start`);
    return true;
  },

  async saveDraft(sessionId: string, questionId: string, answer: string): Promise<boolean> {
    await apiClient.post(`/interviews/${sessionId}/questions/${questionId}/answer`, {
      answer: answer,
      answerFormat: "TEXT",
      durationSeconds: 0
    });
    return true;
  },

  async submitInterview(sessionId: string): Promise<string> {
    // End the interview
    await apiClient.post(`/interviews/${sessionId}/end`);
    
    // Evaluate the interview
    await apiClient.post(`/interviews/${sessionId}/evaluate`);
    
    return `report_${sessionId}`; // Frontend uses this to redirect? We'll see.
  },

  async getRuntimeState(sessionId: string): Promise<any> {
    const res = await apiClient.get(`/interviews/${sessionId}/runtime`);
    return res.data?.data?.runtimeState;
  },

  async navigateQuestion(sessionId: string, action: 'NEXT' | 'PREV' | 'JUMP', targetIndex?: number): Promise<any> {
    const res = await apiClient.patch(`/interviews/${sessionId}/runtime`, { action, targetIndex });
    return res.data?.data?.runtimeState;
  },

  async pauseSession(sessionId: string): Promise<boolean> {
    await apiClient.post(`/interviews/${sessionId}/pause`);
    return true;
  },

  async resumeSession(sessionId: string): Promise<boolean> {
    await apiClient.post(`/interviews/${sessionId}/resume`);
    return true;
  },

  async saveReflection(sessionId: string, questionId: string, reflection: any): Promise<boolean> {
    await apiClient.post(`/interviews/${sessionId}/questions/${questionId}/answer`, {
      metadata: { reflection }
    });
    return true;
  },
};
