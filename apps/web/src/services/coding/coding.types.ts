export type ProblemDifficulty = "Easy" | "Medium" | "Hard";
export type ProblemTopic = "Arrays" | "Strings" | "Hash Table" | "Dynamic Programming" | "Math" | "Sorting" | "Greedy" | "Depth-First Search" | "Breadth-First Search" | "Tree" | "Binary Search" | "Matrix" | "Two Pointers" | "Bit Manipulation" | "Stack" | "Design" | "Graph" | "Linked List" | "Heap (Priority Queue)" | "Backtracking";
export type Language = "javascript" | "typescript" | "python" | "java" | "cpp" | "go" | "rust" | "kotlin";

export interface CompanyTag {
  name: string;
  frequency: "High" | "Medium" | "Low";
}

export interface StarterTemplate {
  language: Language;
  code: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  acceptanceRate: number;
  estimatedTime: number; // in minutes
  status: "Solved" | "Attempted" | "Todo";
  isFavorite: boolean;
  topics: ProblemTopic[];
  companies: CompanyTag[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  starterCode: Record<Language, string>;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ExecutionRequest {
  problemId: string;
  code: string;
  language: Language;
}

export interface ExecutionResult {
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error" | "Time Limit Exceeded" | "Pending";
  runtime: number; // ms
  memory: number; // MB
  stdout: string;
  stderr: string;
  passedCount: number;
  totalCount: number;
}

export interface CodeSmell {
  type: string;
  line: number;
  description: string;
  suggestion: string;
}

export interface ComplexityAnalysis {
  expectedTime: string;
  detectedTime: string;
  expectedSpace: string;
  detectedSpace: string;
  timeExplanation: string;
  spaceExplanation: string;
}

export interface AIReview {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  priority: "High" | "Medium" | "Low";
  confidence: number;
  overallScore: number;
  codeSmells: CodeSmell[];
  complexity: ComplexityAnalysis;
  readabilityScore: number;
  maintainabilityScore: number;
  optimizationScore: number;
  summary: string;
  expectedSolution?: string;
}

export interface Submission {
  id: string;
  problemId: string;
  timestamp: string;
  language: Language;
  code: string;
}

export interface SubmissionReport {
  submission: Submission;
  execution: ExecutionResult;
  aiReview: AIReview;
}

export interface AttemptHistory {
  id: string;
  problemId: string;
  submissionId: string;
  timestamp: string;
  status: ExecutionResult["status"];
  runtime: number;
  memory: number;
  language: Language;
}

export interface CodingAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
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
  favoriteTopic: ProblemTopic;
  practiceTimeMinutes: number;
}

export interface CodingAnalytics {
  stats: CodingStats;
  difficultyDistribution: { difficulty: ProblemDifficulty; count: number }[];
  topicProgress: { topic: ProblemTopic; solved: number; total: number; accuracy: number }[];
  companyDistribution: { company: string; count: number }[];
  weeklyProgress: { date: string; submissions: number; solved: number }[];
  monthlyProgress: { date: string; submissions: number; solved: number }[];
  achievements: CodingAchievement[];
}

export interface LearningRecommendation {
  id: string;
  title: string;
  type: "Topic Focus" | "Company Prep" | "Difficulty Step-Up";
  reason: string;
  suggestedProblemIds: string[];
  companyReadiness?: { company: string; score: number };
  roleReadiness?: { role: string; score: number };
}
