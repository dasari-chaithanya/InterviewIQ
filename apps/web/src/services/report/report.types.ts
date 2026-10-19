export interface ReportScores {
  overall: number;
  technical: number;
  communication: number;
  confidence: number;
  problemSolving: number;
  timeManagement: number;
}

export interface FollowUpExchange {
  question: string;
  answer: string;
}

export interface QuestionResult {
  id: string;
  questionText: string;
  userAnswer: string;
  expectedAnswer: string;
  technicalScore: number;
  communicationScore: number;
  timeSpentSeconds: number;
  difficulty: string;
  category: string;
  keywordsMissing: string[];
  strongPoints: string[];
  weakPoints: string[];
  aiExplanation: string;
  improvementTips: string[];
  grade: "Excellent" | "Good" | "Needs Improvement" | "Weak" | "Skipped";
  /** Phase 4B: follow-up conversation attached to this question, if any. */
  followUp?: { asked: boolean; exchanges: FollowUpExchange[] };
}

export interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  timeframe: "Today" | "This Week" | "This Month" | "Future";
  estimatedHours: number;
  difficulty: "Easy" | "Medium" | "Hard";
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

export interface InterviewReport {
  id: string;
  sessionId: string;
  createdAt: string;
  role: string;
  company: string;
  difficulty: string;
  interviewType: string;
  durationSeconds: number;
  totalQuestions: number;
  answeredQuestions: number;
  skippedQuestions: number;
  scores: ReportScores;
  questionResults: QuestionResult[];
  radarData: RadarDataPoint[];
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  roadmap: RoadmapItem[];
  aiInsights: string[];
}

export interface HistoryEntry {
  id: string;
  sessionId: string;
  reportId: string;
  role: string;
  company: string;
  difficulty: string;
  type: string;
  score: number;
  date: string;
  durationMinutes: number;
  questionsAnswered: number;
  totalQuestions: number;
  status: "Completed" | "In Progress" | "Abandoned";
}

export interface AnalyticsKPIs {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  practiceHoursTotal: number;
  currentStreak: number;
  longestStreak: number;
  questionsAnswered: number;
  aiReadiness: number;
}

export interface TrendPoint {
  date: string;
  score: number;
  label?: string;
}

export interface TopicStat {
  topic: string;
  accuracy: number;
  attempts: number;
  trend: "up" | "down" | "stable";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface CompanyReadiness {
  company: string;
  readinessPercentage: number;
  weakSkills: string[];
  strongSkills: string[];
  estimatedSuccess: "High" | "Medium" | "Low";
}

export interface RoleReadiness {
  role: string;
  matchPercentage: number;
  missingSkills: string[];
  learningSuggestions: string[];
}

export interface AICoachRecommendation {
  type: "Practice" | "Interview" | "Review";
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  actionLabel: string;
  actionHref: string;
}

export interface AICoachData {
  practiceToday: AICoachRecommendation[];
  improvedTopics: string[];
  declinedTopics: string[];
  recommendedCompany: string;
  recommendedRole: string;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}
