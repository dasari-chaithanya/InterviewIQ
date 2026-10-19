export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type InterviewType = "HR" | "Technical" | "Resume" | "Behavioral" | "Coding" | "System Design" | "SQL";
export type VoiceMode = "Text" | "Voice";
export type QuestionSource = "QUESTION_BANK" | "LEGACY";
export type SessionStatus = "Not Started" | "In Progress" | "Completed" | "Failed" | "Scheduled";

export interface InterviewConfiguration {
  resumeId?: string; // Optional if they continue without a resume
  role: string;
  company: string;
  difficulty: Difficulty;
  type: InterviewType;
  durationMinutes: number;
  questionCount: number;
  voiceMode: VoiceMode;
  allowFollowUps: boolean;
  codingChallengeEnabled: boolean;
  /** QUESTION_BANK uses curated selection; LEGACY uses AI generation. Defaults to LEGACY. */
  questionSource?: QuestionSource;
  /** Explicit preset; QUICK_CHECK forces the 10-MCQ diagnostic policy server-side. */
  preset?: "QUICK_CHECK";
  /** Canonical Role slug captured at setup (used by presets instead of free text). */
  roleSlug?: string;
  quickCheck?: {
    count: number;
    maxPerSkill: number;
  };
}

export interface InterviewProgress {
  currentQuestionIndex: number;
  completedQuestions: number;
  scoreSoFar: number;
  timeElapsedSeconds: number;
}

export interface InterviewSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: SessionStatus;
  configuration: InterviewConfiguration;
  progress: InterviewProgress;
  finalScore?: number;
  /** Phase 5: UTC instant + IANA zone; absent for instant/legacy sessions. */
  scheduledAt?: string | null;
  scheduledTimezone?: string | null;
}

export interface InterviewRecommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  configuration: Partial<InterviewConfiguration>;
}

export interface InterviewStatistics {
  totalInterviews: number;
  averageScore: number;
  totalTimeSpentMinutes: number;
  strongestTopic: string;
  weakestTopic: string;
}
