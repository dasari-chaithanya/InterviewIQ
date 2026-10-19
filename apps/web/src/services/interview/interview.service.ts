import { apiClient } from "@/lib/api/api.client";
import { 
  InterviewSession, 
  InterviewConfiguration, 
  InterviewRecommendation,
  InterviewStatistics
} from "./interview.types";

const mapSession = (session: any): InterviewSession => ({
  ...session,
  configuration: session.configuration || {
    role: "Unknown Role",
    company: "Unknown Company",
    difficulty: "Medium",
    type: "Technical",
    questionCount: 5,
    codingChallengeEnabled: false,
    questionSource: "LEGACY"
  },
  progress: session.progress || {
    currentQuestionIndex: session.currentQuestionIndex || 0,
    completedQuestions: session.currentQuestionIndex || 0,
    scoreSoFar: 0,
    timeElapsedSeconds: 0,
  }
});

export const interviewService = {
  async getRecentSessions(): Promise<InterviewSession[]> {
    const response = await apiClient.get("/interviews");
    return response.data.data.sessions.map(mapSession);
  },

  async getSession(id: string): Promise<InterviewSession | null> {
    try {
      const response = await apiClient.get(`/interviews/${id}`);
      return mapSession(response.data.data.session);
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getRecommendations(): Promise<InterviewRecommendation[]> {
    const response = await apiClient.get("/interviews/coach");
    const rawRecs = response.data.data.recommendations || [];
    return rawRecs.map((rec: any, index: number) => ({
      id: `rec-${index}`,
      title: `${rec.category} Coaching`,
      description: rec.recommendation,
      actionText: "Practice Now",
      configuration: {}
    }));
  },

  async getStatistics(): Promise<InterviewStatistics> {
    const [statsResponse, analyticsResponse] = await Promise.all([
      apiClient.get("/interviews/statistics"),
      apiClient.get("/interviews/analytics")
    ]);
    const stats = statsResponse.data.data.statistics || {};
    const analytics = analyticsResponse.data.data.analytics || {};
    
    return {
      totalInterviews: stats.totalInterviews || 0,
      averageScore: analytics.overallAverageScore || 0,
      totalTimeSpentMinutes: Math.round((stats.totalPracticeHours || 0) * 60),
      strongestTopic: stats.bestCategory || "None",
      weakestTopic: stats.weakestCategory || "None"
    };
  },

  async createSession(config: InterviewConfiguration): Promise<InterviewSession> {
    const difficultyMap: Record<string, string> = {
      "Beginner": "EASY",
      "Intermediate": "MEDIUM",
      "Advanced": "HARD"
    };

    const typeMap: Record<string, string> = {
      "HR": "BEHAVIORAL",
      "Technical": "TECHNICAL",
      "Resume": "MIXED",
      "Behavioral": "BEHAVIORAL",
      "Coding": "TECHNICAL",
      "System Design": "TECHNICAL",
      "SQL": "TECHNICAL"
    };

    const payload: any = {
      ...config,
      title: `${config.type || "General"} Interview for ${config.role || "Target Role"}`,
      difficulty: difficultyMap[config.difficulty] || "MEDIUM",
      interviewType: typeMap[config.type] || "MIXED",
    };

    if (!payload.resumeId) {
      delete payload.resumeId;
    }

    const response = await apiClient.post("/interviews", payload);
    return mapSession(response.data.data.session);
  },

  async deleteSession(id: string): Promise<boolean> {
    await apiClient.delete(`/interviews/${id}`);
    return true;
  },

  /**
   * Phase 5 scheduling. Sends wall-clock + explicit IANA zone; the server
   * owns conversion, validation, and start eligibility.
   */
  async scheduleSession(id: string, input: { scheduledAtLocal: string; timeZone: string }): Promise<void> {
    await apiClient.post(`/interviews/${id}/schedule`, input);
  },

  async rescheduleSession(id: string, input: { scheduledAtLocal: string; timeZone: string }): Promise<void> {
    await apiClient.patch(`/interviews/${id}/schedule`, input);
  }
};
