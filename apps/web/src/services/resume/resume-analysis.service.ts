import { apiClient } from "@/lib/api/api.client";
import { ResumeAnalysis } from "./resume-analysis.types";

export const resumeAnalysisService = {
  async analyzeResume(resumeId: string): Promise<ResumeAnalysis> {
    const response = await apiClient.post(`/resumes/${resumeId}/analysis`);
    return response.data.data.analysis;
  },

  async getAnalysis(resumeId: string): Promise<ResumeAnalysis | null> {
    try {
      const response = await apiClient.get(`/resumes/${resumeId}/analysis`);
      return response.data.data.analysis;
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async deleteAnalysis(resumeId: string): Promise<boolean> {
    await apiClient.delete(`/resumes/${resumeId}/analysis`);
    return true;
  }
};
