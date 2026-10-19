import { Difficulty } from "@/services/interview/interview.types";

export type QuestionCategory = "Technical" | "Behavioral" | "System Design" | "Algorithms" | "Culture Fit" | "Resume Deep Dive";

export type QuestionStatus = "Unanswered" | "Answered" | "Skipped" | "Marked";

export type ConnectionStatus = "Connected" | "Saving" | "Reconnecting" | "Offline";

export interface RuntimeQuestion {
  id: string;
  order: number;
  text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
  hints: string[];
}

export type ReflectionType =
  | "DID_NOT_KNOW"
  | "COULD_NOT_EXPLAIN"
  | "NEED_MORE_PRACTICE"
  | "RECALL_UNDER_PRESSURE"
  | "OTHER";

export interface QuestionReflection {
  reflectionType?: ReflectionType;
  note?: string;
  flagged?: boolean;
}

export interface RuntimeAnswer {
  questionId: string;
  text: string;
  timeSpentSeconds: number;
  status: QuestionStatus;
  lastSavedAt?: string;
  reflection?: QuestionReflection;
}

export interface RuntimeState {
  sessionId: string;
  questions: RuntimeQuestion[];
  answers: Record<string, RuntimeAnswer>;
  currentQuestionIndex: number;
  timeElapsedSeconds: number;

  // Timer
  isPaused: boolean;

  // Submission
  isSubmitting: boolean;
  isFinished: boolean;

  // Auto-save
  lastAutoSaveAt: string | null;
  connectionStatus: ConnectionStatus;

  // Dialogs
  isExitDialogOpen: boolean;
  isFinishDialogOpen: boolean;
  isShortcutDialogOpen: boolean;
  isQuestionMapOpen: boolean; // Mobile drawer

  // Derived (computed by reducer for convenience)
  answeredCount: number;
  skippedCount: number;
  markedCount: number;
}

export type RuntimeAction =
  | { type: "SET_QUESTIONS"; payload: { sessionId: string; questions: RuntimeQuestion[] } }
  | { 
      type: "HYDRATE_RUNTIME"; 
      payload: { 
        sessionId: string; 
        questions: RuntimeQuestion[]; 
        currentQuestionIndex: number; 
        answers: Record<string, RuntimeAnswer>; 
        isPaused: boolean; 
        timeElapsedSeconds: number; 
      } 
    }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "JUMP_TO_QUESTION"; payload: number }
  | { type: "UPDATE_ANSWER"; payload: { questionId: string; text: string } }
  | { type: "MARK_QUESTION"; payload: string }
  | { type: "SKIP_QUESTION"; payload: string }
  | { type: "SET_REFLECTION"; payload: { questionId: string; reflection: QuestionReflection } }
  | { type: "TICK_TIMER" }
  | { type: "PAUSE_TIMER" }
  | { type: "RESUME_TIMER" }
  | { type: "SET_AUTOSAVE"; payload: string }
  | { type: "SET_CONNECTION"; payload: ConnectionStatus }
  | { type: "TOGGLE_EXIT_DIALOG" }
  | { type: "TOGGLE_FINISH_DIALOG" }
  | { type: "TOGGLE_SHORTCUT_DIALOG" }
  | { type: "TOGGLE_QUESTION_MAP" }
  | { type: "SET_FINISHED" };
