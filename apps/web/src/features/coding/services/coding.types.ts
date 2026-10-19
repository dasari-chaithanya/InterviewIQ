export type Difficulty = "Easy" | "Medium" | "Hard";
export type Status = "Solved" | "Attempted" | "Todo";
export type Language = "javascript" | "typescript" | "python" | "java" | "cpp" | "go" | "rust";

export interface CompanyTag {
  name: string;
  frequency: "High" | "Medium" | "Low";
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  acceptanceRate: number;
  status: Status;
  isFavorite: boolean;
  topics: string[];
  companies: CompanyTag[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  starterCode: Record<Language, string>;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ExecutionResult {
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error" | "Time Limit Exceeded" | "Pending";
  runtime: number; // in ms
  memory: number; // in MB
  stdout: string;
  stderr: string;
  passedCount: number;
  totalCount: number;
}

export interface AIComplexityAnalysis {
  expectedTime: string;
  detectedTime: string;
  expectedSpace: string;
  detectedSpace: string;
  timeExplanation: string;
  spaceExplanation: string;
}

export interface AICodeSmell {
  type: "Unused Variable" | "Magic Number" | "Duplicate Logic" | "Deep Nesting" | "Poor Naming" | "Long Function" | "Other";
  line: number;
  description: string;
  suggestion: string;
}

export interface SubmissionReport {
  id: string;
  problemId: string;
  timestamp: string;
  language: Language;
  code: string;
  execution: ExecutionResult;
  complexity: AIComplexityAnalysis;
  codeSmells: AICodeSmell[];
  aiSummary: string;
  optimizedSolution?: string; // for git diff comparison
}

export interface CodingStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  currentStreak: number;
  longestStreak: number;
  favoriteLanguage: Language;
  recentSubmissions: SubmissionReport[];
}
