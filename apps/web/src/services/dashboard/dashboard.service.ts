import { apiClient } from "@/lib/api/api.client";
import {
  DashboardSummary,
  StatItem,
  RecentInterview,
  Recommendation,
  Goal,
  AnalyticsPreviewData
} from "./dashboard.types";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await apiClient.get("/users/dashboard");
    const d = res.data.data.dashboard;
    return {
      streak: d.currentStreak || 0,
      practiceGoal: { current: d.interviewsCompleted || 0, target: 5 }, // Hardcoded 5 as default target until goal tracking Phase is done
      resumeCompleted: d.resumeCount > 0,
      overallScore: d.overallScore, // Now correctly fetched from backend
    };
  },

  async getStats(): Promise<StatItem[]> {
    const res = await apiClient.get("/interviews/statistics");
    const s = res.data.data.statistics;
    return [
      { id: "1", title: "Total Interviews", value: s?.totalInterviews || 0, trend: 0, trendLabel: "vs last month", icon: "Mic" },
      { id: "2", title: "Average Score", value: s?.averageScore != null ? `${s.averageScore}%` : "0%", trend: 0, trendLabel: "vs last month", icon: "TrendingUp" },
      { id: "3", title: "Practice Time", value: `${Math.round((s?.totalDurationMinutes || 0) / 60)}h`, trend: 0, trendLabel: "vs last month", icon: "Clock" },
      { id: "4", title: "Current Streak", value: `${s?.currentStreak || 0} days`, trend: 0, trendLabel: "Active now", icon: "Flame" },
    ];
  },

  async getRecentInterviews(): Promise<RecentInterview[]> {
    const res = await apiClient.get("/interviews?limit=5");
    return res.data.data.sessions.map((session: {
      id: string;
      company: string;
      role: string;
      createdAt: string;
      evaluation?: { overallScore?: number };
      status: string;
    }) => ({
      id: session.id,
      company: session.company,
      role: session.role,
      date: session.createdAt,
      score: session.evaluation?.overallScore || 0,
      status: session.status === "COMPLETED" ? "Completed" : "In Progress",
    }));
  },

  async getContinuePractice(): Promise<RecentInterview | null> {
    const res = await apiClient.get("/interviews?status=IN_PROGRESS&limit=1");
    if (res.data.data.sessions && res.data.data.sessions.length > 0) {
      const session = res.data.data.sessions[0];
      return {
        id: session.id,
        company: session.company,
        role: session.role,
        date: session.createdAt,
        score: session.evaluation?.overallScore || 0,
        status: "In Progress",
      };
    }
    return null;
  },

  async getRecommendations(): Promise<Recommendation[]> {
    // Actually returning correct fields based on backend coach.engine.ts
    const res = await apiClient.get("/interviews/coach");
    return res.data.data.recommendations.map((r: {
      category: string;
      recommendation: string;
      priority: string;
    }) => ({
      id: Math.random().toString(),
      title: r.category || "General",
      description: r.recommendation || "",
      type: "general", // Use general placeholder until specific type is properly derived
      actionText: "Review",
    }));
  },

  async getGoals(): Promise<Goal[]> {
    // Phase 2B requires honest state. Do not return fake goals if they aren't stored.
    return [];
  },

  async getAnalyticsPreview(): Promise<AnalyticsPreviewData> {
    const res = await apiClient.get("/interviews/analytics");
    const a = res.data.data.analytics;
    
    // Performance trend is not implemented properly in backend for /analytics, 
    // we should leave it empty if missing.
    return {
      weeklyTrend: Array.isArray(a?.performanceTrend) ? a.performanceTrend.map((t: { date: string; score: number }) => ({
        name: t.date,
        score: t.score
      })) : [],
      topicDistribution: Object.entries(a?.skillsAnalysis || {}).map(([topic, score]: [string, unknown]) => ({
        topic,
        score: (score as { score?: number }).score || 0,
        fullMark: 100
      })) || []
    };
  }
};
