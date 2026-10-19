import { apiClient } from "@/lib/api/api.client";
import {
  Problem,
  ExecutionResult,
  SubmissionReport,
  AttemptHistory,
  CodingAnalytics,
  LearningRecommendation,
  ExecutionRequest
} from "./coding.types";

export const codingService = {
  async getProblems(): Promise<Problem[]> {
    const response = await apiClient.get("/coding/problems");
    return response.data.data || [];
  },

  async getProblem(id: string): Promise<Problem | null> {
    try {
      const response = await apiClient.get(`/coding/problems/${id}`);
      return response.data.data.problem;
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async runCode(request: ExecutionRequest): Promise<ExecutionResult> {
    const workspaceRes = await apiClient.get(`/coding/workspaces/problem/${request.problemId}`);
    const workspaceId = workspaceRes.data.data.workspace.id;

    const startRes = await apiClient.post(`/coding/executions/run`, {
      workspaceId,
      language: request.language,
      sourceCode: request.code,
    });
    
    const executionId = startRes.data.data.execution.id;
    
    while (true) {
      const pollRes = await apiClient.get(`/coding/executions/${executionId}`);
      const execution = pollRes.data.data.execution;
      if (execution.status !== "PENDING" && execution.status !== "PROCESSING") {
        return execution;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  },

  async submitSolution(request: ExecutionRequest): Promise<SubmissionReport> {
    const workspaceRes = await apiClient.get(`/coding/workspaces/problem/${request.problemId}`);
    const workspaceId = workspaceRes.data.data.workspace.id;

    const startRes = await apiClient.post(`/coding/submissions`, {
      workspaceId,
      language: request.language,
      sourceCode: request.code,
    });
    
    const submissionId = startRes.data.data.submission.id;
    
    while (true) {
      const pollRes = await apiClient.get(`/coding/submissions/${submissionId}`);
      const submission = pollRes.data.data.submission;
      if (submission.status !== "PENDING" && submission.status !== "PROCESSING") {
        // Build the expected SubmissionReport format
        return {
          submission: {
            id: submission.id,
            problemId: request.problemId,
            timestamp: submission.createdAt,
            language: submission.language,
            code: submission.sourceCode,
          },
          execution: {
            status: submission.status,
            runtime: submission.runtime || 0,
            memory: submission.memory || 0,
            stdout: submission.stdout || "",
            stderr: submission.stderr || "",
            passedCount: submission.passedCount || 0,
            totalCount: submission.totalCount || 0,
          },
          aiReview: submission.aiReview || null
        } as unknown as SubmissionReport;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  },

  async getAnalytics(): Promise<CodingAnalytics> {
    const [analyticsRes, statsRes, achievementsRes] = await Promise.all([
      apiClient.get("/coding/analytics").catch(() => ({ data: { data: {} } })),
      apiClient.get("/coding/statistics").catch(() => ({ data: { data: {} } })),
      apiClient.get("/coding/achievements").catch(() => ({ data: { data: [] } }))
    ]);

    const analytics = analyticsRes.data?.data || {};
    const stats = statsRes.data?.data || {};
    const achievements = achievementsRes.data?.data || [];
    
    const diff = analytics.difficultyDistribution || {};

    return {
      stats: {
        totalSolved: analytics.problemsSolved || 0,
        easySolved: diff["Easy"] || 0,
        mediumSolved: diff["Medium"] || 0,
        hardSolved: diff["Hard"] || 0,
        acceptanceRate: analytics.acceptanceRate || 0,
        currentStreak: stats.currentStreak || 0,
        longestStreak: stats.longestStreak || 0,
        favoriteLanguage: "typescript",
        favoriteTopic: "Arrays",
        practiceTimeMinutes: (stats.practiceHours || 0) * 60,
      },
      difficultyDistribution: [
        { difficulty: "Easy", count: diff["Easy"] || 0 },
        { difficulty: "Medium", count: diff["Medium"] || 0 },
        { difficulty: "Hard", count: diff["Hard"] || 0 }
      ],
      topicProgress: Object.entries(analytics.categoryDistribution || {}).map(([topic, count]) => ({
        topic: topic as any,
        solved: count as number,
        total: (count as number) + 5,
        accuracy: 100
      })),
      companyDistribution: [],
      weeklyProgress: [],
      monthlyProgress: [],
      achievements: achievements
    };
  },

  async getAttemptHistory(problemId: string): Promise<AttemptHistory[]> {
    const response = await apiClient.get(`/coding/submissions/problem/${problemId}`);
    return response.data.data || [];
  },

  async getLearningRecommendations(): Promise<LearningRecommendation[]> {
    const response = await apiClient.get("/coding/learning");
    return response.data.data || [];
  }
};
