export interface DashboardSummary {
  streak: number;
  practiceGoal: {
    current: number;
    target: number;
  };
  resumeCompleted: boolean;
  overallScore: number;
}

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  icon: string;
}

export interface RecentInterview {
  id: string;
  company: string;
  role: string;
  date: string;
  score: number;
  status: "Completed" | "In Progress" | "Needs Review";
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: "technical" | "behavioral" | "system_design" | "general";
  actionText: string;
}

export interface Goal {
  id: string;
  title: string;
  completed: number;
  total: number;
  type: "daily" | "weekly";
}

export interface TopicDistribution {
  topic: string;
  score: number;
  fullMark: number;
}

export interface WeeklyScore {
  name: string;
  score: number;
}

export interface AnalyticsPreviewData {
  weeklyTrend: WeeklyScore[];
  topicDistribution: TopicDistribution[];
}
