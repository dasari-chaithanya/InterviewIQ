"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeAnalysisService } from "@/services/resume/resume-analysis.service";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/api.errors";
import { queryKeys } from "@/lib/api/query.keys";

export function useResumeAnalysis(resumeId: string) {
  return useQuery({
    queryKey: ["resumeAnalysis", resumeId],
    queryFn: () => resumeAnalysisService.getAnalysis(resumeId),
    enabled: !!resumeId,
    // Poll every 3 seconds if data is null (meaning it's still generating)
    refetchInterval: (query) => (query.state.data === null ? 3000 : false),
  });
}

export function useAnalyzeResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: string) => resumeAnalysisService.analyzeResume(resumeId),
    onSuccess: (data, resumeId) => {
      queryClient.setQueryData(["resumeAnalysis", resumeId], data);
      
      // We also want to update the resume's aiAnalyzed flag in the resumes list
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.detail(resumeId) });
      
      toast.success("Resume analysis started!");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to analyze resume. Please try again.");
    }
  });
}
