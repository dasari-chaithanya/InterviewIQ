"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { RuntimeState, RuntimeAction, RuntimeAnswer, RuntimeQuestion } from "../types/runtime.types";

// ─── Helpers ────────────────────────────────────────────────

function computeCounts(answers: Record<string, RuntimeAnswer>) {
  let answeredCount = 0;
  let skippedCount = 0;
  let markedCount = 0;
  for (const a of Object.values(answers)) {
    if (a.status === "Answered") answeredCount++;
    else if (a.status === "Skipped") skippedCount++;
    else if (a.status === "Marked") markedCount++;
  }
  return { answeredCount, skippedCount, markedCount };
}

// ─── Initial State ──────────────────────────────────────────

const initialState: RuntimeState = {
  sessionId: "",
  questions: [],
  answers: {},
  currentQuestionIndex: 0,
  timeElapsedSeconds: 0,
  isPaused: false,
  isSubmitting: false,
  isFinished: false,
  lastAutoSaveAt: null,
  connectionStatus: "Connected",
  isExitDialogOpen: false,
  isFinishDialogOpen: false,
  isShortcutDialogOpen: false,
  isQuestionMapOpen: false,
  answeredCount: 0,
  skippedCount: 0,
  markedCount: 0,
};

// ─── Reducer ────────────────────────────────────────────────

function runtimeReducer(state: RuntimeState, action: RuntimeAction): RuntimeState {
  switch (action.type) {
    case "SET_QUESTIONS": {
      const initAnswers: Record<string, RuntimeAnswer> = {};
      action.payload.questions.forEach((q: RuntimeQuestion) => {
        initAnswers[q.id] = {
          questionId: q.id,
          text: "",
          timeSpentSeconds: 0,
          status: "Unanswered",
        };
      });
      return {
        ...state,
        sessionId: action.payload.sessionId,
        questions: action.payload.questions,
        answers: initAnswers,
        currentQuestionIndex: 0,
        timeElapsedSeconds: 0,
        ...computeCounts(initAnswers),
      };
    }

    case "HYDRATE_RUNTIME": {
      return {
        ...state,
        sessionId: action.payload.sessionId,
        questions: action.payload.questions,
        answers: action.payload.answers,
        currentQuestionIndex: action.payload.currentQuestionIndex,
        isPaused: action.payload.isPaused,
        timeElapsedSeconds: action.payload.timeElapsedSeconds,
        ...computeCounts(action.payload.answers),
      };
    }

    case "NEXT_QUESTION":
      if (state.currentQuestionIndex < state.questions.length - 1) {
        return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
      }
      return state;

    case "PREV_QUESTION":
      if (state.currentQuestionIndex > 0) {
        return { ...state, currentQuestionIndex: state.currentQuestionIndex - 1 };
      }
      return state;

    case "JUMP_TO_QUESTION":
      if (action.payload >= 0 && action.payload < state.questions.length) {
        return { ...state, currentQuestionIndex: action.payload, isQuestionMapOpen: false };
      }
      return state;

    case "UPDATE_ANSWER": {
      const { questionId, text } = action.payload;
      const newAnswers = {
        ...state.answers,
        [questionId]: {
          ...state.answers[questionId],
          text,
          status: text.trim().length > 0 ? "Answered" as const : "Unanswered" as const,
        },
      };
      return { ...state, answers: newAnswers, ...computeCounts(newAnswers) };
    }

    case "MARK_QUESTION": {
      const id = action.payload;
      const cur = state.answers[id];
      const newStatus = cur.status === "Marked"
        ? (cur.text.trim() ? "Answered" as const : "Unanswered" as const)
        : "Marked" as const;
      const newAnswers = {
        ...state.answers,
        [id]: { ...cur, status: newStatus },
      };
      return { ...state, answers: newAnswers, ...computeCounts(newAnswers) };
    }

    case "SKIP_QUESTION": {
      const id = action.payload;
      const newAnswers = {
        ...state.answers,
        [id]: { ...state.answers[id], status: "Skipped" as const },
      };
      return { ...state, answers: newAnswers, ...computeCounts(newAnswers) };
    }

    case "SET_REFLECTION": {
      const { questionId, reflection } = action.payload;
      const cur = state.answers[questionId] || {
        questionId,
        text: "",
        timeSpentSeconds: 0,
        status: "Unanswered" as const,
      };
      const newAnswers = {
        ...state.answers,
        [questionId]: {
          ...cur,
          reflection,
        },
      };
      return { ...state, answers: newAnswers };
    }

    case "TICK_TIMER": {
      if (state.isPaused || state.isFinished || state.questions.length === 0) return state;
      const activeQ = state.questions[state.currentQuestionIndex];
      if (!activeQ || !state.answers[activeQ.id]) return state;
      return {
        ...state,
        timeElapsedSeconds: state.timeElapsedSeconds + 1,
        answers: {
          ...state.answers,
          [activeQ.id]: {
            ...state.answers[activeQ.id],
            timeSpentSeconds: state.answers[activeQ.id].timeSpentSeconds + 1,
          },
        },
      };
    }

    case "PAUSE_TIMER":
      return { ...state, isPaused: true };

    case "RESUME_TIMER":
      return { ...state, isPaused: false };

    case "SET_AUTOSAVE":
      return { ...state, lastAutoSaveAt: action.payload, connectionStatus: "Connected" };

    case "SET_CONNECTION":
      return { ...state, connectionStatus: action.payload };

    case "TOGGLE_EXIT_DIALOG":
      return { ...state, isExitDialogOpen: !state.isExitDialogOpen };

    case "TOGGLE_FINISH_DIALOG":
      return { ...state, isFinishDialogOpen: !state.isFinishDialogOpen };

    case "TOGGLE_SHORTCUT_DIALOG":
      return { ...state, isShortcutDialogOpen: !state.isShortcutDialogOpen };

    case "TOGGLE_QUESTION_MAP":
      return { ...state, isQuestionMapOpen: !state.isQuestionMapOpen };

    case "SET_FINISHED":
      return { ...state, isFinished: true, isPaused: true };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────

const RuntimeContext = createContext<{
  state: RuntimeState;
  dispatch: React.Dispatch<RuntimeAction>;
} | null>(null);

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(runtimeReducer, initialState);

  // Global Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "TICK_TIMER" });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <RuntimeContext.Provider value={{ state, dispatch }}>
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntimeStore() {
  const context = useContext(RuntimeContext);
  if (!context) {
    throw new Error("useRuntimeStore must be used within a RuntimeProvider");
  }
  return context;
}
