import { apiClient } from "@/lib/api/api.client";
import {
  InterviewReport,
  HistoryEntry,
  AnalyticsKPIs,
  TrendPoint,
  TopicStat,
  Achievement,
  HeatmapDay,
  CompanyReadiness,
  RoleReadiness,
  AICoachData
} from "./report.types";

export const reportService = {
  /** Raw evaluation lifecycle status; null when no evaluation exists yet. */
  async getEvaluationStatus(sessionId: string): Promise<string | null> {
    try {
      const response = await apiClient.get(`/interviews/${sessionId}/evaluation`);
      return (response.data?.data?.evaluation?.processingStatus as string) ?? null;
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 404) return null;
      throw error;
    }
  },

  /** Trigger evaluation, treating "already exists" as already-in-progress. */
  async ensureEvaluation(sessionId: string): Promise<void> {
    try {
      await apiClient.post(`/interviews/${sessionId}/evaluate`);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      // 400 here means a row already exists (pending/processing/complete):
      // the status poll below picks up the real state. Anything else is real.
      if (status !== 400) throw error;
    }
  },

  /** Retry a failed evaluation via the existing reanalyze contract. */
  async retryEvaluation(sessionId: string): Promise<void> {
    await apiClient.post(`/interviews/${sessionId}/evaluation/reanalyze`);
  },

  // Individual Report
  async getReport(sessionId: string): Promise<InterviewReport> {
    const response = await apiClient.get(`/interviews/${sessionId}/evaluation/report`);
    const report = response.data.data.report as {
      evaluation: {
        id: string;
        sessionId: string;
        createdAt: string;
        overallScore?: number | null;
        communicationScore?: number | null;
        technicalScore?: number | null;
        problemSolvingScore?: number | null;
        confidenceScore?: number | null;
        timeManagementScore?: number | null;
        summary?: string | null;
        strengths?: string[] | null;
        weaknesses?: string[] | null;
        recommendations?: string[] | null;
        questionBreakdown?: { questionId?: string; score?: number; feedback?: string }[] | null;
        processingStatus?: string;
      };
      session: { role: string; company: string | null; difficulty: string; interviewType: string };
      questions: {
        order: number;
        title: string;
        description: string;
        type: string;
        difficulty: string;
        answer: string;
        durationSeconds: number;
        followUps: { question: string; answer: string }[];
      }[];
      metrics: {
        totalQuestions: number;
        answeredQuestions: number;
        unansweredQuestions: number;
        completionRate: number;
        durationSeconds: number;
        followUpCount: number;
        questionsWithFollowUps: number;
      };
    };
    const evaluation = report.evaluation;
    const breakdown = evaluation.questionBreakdown ?? [];
    const num = (v: number | null | undefined) => (typeof v === 'number' ? v : 0);

    // Map backend report to frontend InterviewReport. Never surfaces
    // expected answers or rubrics: the backend never sends them.
    return {
      id: evaluation.id,
      sessionId: evaluation.sessionId,
      createdAt: evaluation.createdAt,
      role: report.session.role,
      company: report.session.company || 'Tech Company',
      difficulty: report.session.difficulty,
      interviewType: report.session.interviewType,
      durationSeconds: report.metrics.durationSeconds,
      totalQuestions: report.metrics.totalQuestions,
      answeredQuestions: report.metrics.answeredQuestions,
      skippedQuestions: report.metrics.unansweredQuestions,
      scores: {
        overall: num(evaluation.overallScore),
        technical: num(evaluation.technicalScore),
        communication: num(evaluation.communicationScore),
        confidence: num(evaluation.confidenceScore),
        problemSolving: num(evaluation.problemSolvingScore),
        timeManagement: num(evaluation.timeManagementScore),
      },
      questionResults: report.questions.map((q, index) => {
        const fb = breakdown[index] as { score?: number; feedback?: string } | undefined;
        const score = num(fb?.score);
        return {
          id: `q-${q.order}`,
          questionText: q.title,
          userAnswer: q.answer,
          expectedAnswer: '',
          technicalScore: score,
          communicationScore: num(evaluation.communicationScore),
          timeSpentSeconds: q.durationSeconds,
          difficulty: q.difficulty,
          category: q.type,
          keywordsMissing: [],
          strongPoints: [],
          weakPoints: [],
          aiExplanation: fb?.feedback || '',
          improvementTips: [],
          // Derived honestly from the persisted per-question score; unanswered
          // questions (no answer text) are always Skipped, never graded.
          grade: !q.answer ? 'Skipped' : score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Weak',
          followUp:
            q.followUps.length > 0
              ? { asked: true, exchanges: q.followUps.map((f) => ({ question: f.question, answer: f.answer })) }
              : { asked: false, exchanges: [] },
        };
      }),
      radarData: [
        { subject: 'Technical', score: num(evaluation.technicalScore), fullMark: 100 },
        { subject: 'Communication', score: num(evaluation.communicationScore), fullMark: 100 },
        { subject: 'Problem Solving', score: num(evaluation.problemSolvingScore), fullMark: 100 },
        { subject: 'Confidence', score: num(evaluation.confidenceScore), fullMark: 100 },
      ],
      aiSummary: evaluation.summary || '',
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      roadmap: (evaluation.recommendations || []).map((item: string, i: number) => ({
        id: `rm-${i}`,
        title: item,
        description: '',
        timeframe: 'This Week',
        estimatedHours: 2,
        difficulty: 'Medium',
        priority: 'High',
        completed: false,
      })),
      aiInsights: [],
    };
  },

  // History
  async getHistory(): Promise<HistoryEntry[]> {
    const response = await apiClient.get("/interviews/history");
    return response.data.data.history.map((h: { id: string; role: string; company: string; difficulty: string; interviewType: string; createdAt: string; status: string; evaluation?: { id: string; overallScore?: number }; questions?: { status: string }[]; }) => ({
      id: h.id,
      sessionId: h.id,
      reportId: h.evaluation?.id || "",
      role: h.role,
      company: h.company,
      difficulty: h.difficulty,
      type: h.interviewType,
      score: h.evaluation?.overallScore || 0,
      date: h.createdAt,
      durationMinutes: 60,
      questionsAnswered: h.questions?.filter((q: { status: string }) => q.status === "ANSWERED").length || 0,
      totalQuestions: h.questions?.length || 0,
      status: h.status === "COMPLETED" ? "Completed" : (h.status === "IN_PROGRESS" ? "In Progress" : "Abandoned"),
    }));
  },

  // Analytics
  async getKPIs(): Promise<AnalyticsKPIs> {
    const response = await apiClient.get("/interviews/statistics");
    const s = response.data.data.statistics;
    return {
      totalInterviews: s.totalInterviews || 0,
      averageScore: s.averageScore || 0,
      bestScore: s.bestScore || 0,
      practiceHoursTotal: Math.round((s.totalDurationMinutes || 0) / 60),
      currentStreak: 0,
      longestStreak: 0,
      questionsAnswered: 0,
      aiReadiness: 0,
    };
  },

  async getScoreTrend(): Promise<TrendPoint[]> {
    const response = await apiClient.get("/interviews/analytics");
    const a = response.data.data.analytics;
    return a?.performanceTrend?.map((t: { date: string; score: number }) => ({
      date: t.date,
      score: t.score,
    })) || [];
  },

  async getTopicStats(): Promise<TopicStat[]> {
    const response = await apiClient.get("/interviews/analytics");
    const a = response.data.data.analytics;
    return (Object.entries(a?.skillsAnalysis || {}) as [string, { score?: number }][]).map(([topic, stat]) => ({
      topic,
      accuracy: stat.score || 0,
      attempts: 5,
      trend: "stable",
    }));
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await apiClient.get("/interviews/achievements");
    return response.data.data.achievements || [];
  },

  async getHeatmap(): Promise<HeatmapDay[]> {
    const response = await apiClient.get("/interviews/timeline");
    return response.data.data.timeline || [];
  },

  async getCompanyReadiness(): Promise<CompanyReadiness[]> {
    // Return empty array for now since backend doesn't explicitly expose this
    return [];
  },

  async getRoleReadiness(): Promise<RoleReadiness[]> {
    return [];
  },

  async getAICoachData(): Promise<AICoachData> {
    const response = await apiClient.get("/interviews/coach");
    const recs = response.data.data.recommendations;
    return {
      practiceToday: recs.map((r: { title: string; description: string }) => ({
        type: "Practice",
        title: r.title,
        description: r.description,
        priority: "Medium",
        actionLabel: "Start",
        actionHref: "/dashboard"
      })),
      improvedTopics: [],
      declinedTopics: [],
      recommendedCompany: "Google",
      recommendedRole: "Software Engineer",
      weeklyGoalProgress: 60,
      monthlyGoalProgress: 40,
    };
  }
};
