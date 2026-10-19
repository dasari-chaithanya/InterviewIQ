"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { codingService } from "./coding.service";
import { ExecutionRequest } from "./coding.types";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/api.errors";
import { queryKeys } from "@/lib/api/query.keys";

export function useProblems() {
  return useQuery({
    queryKey: queryKeys.coding.problems,
    queryFn: () => codingService.getProblems(),
  });
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: queryKeys.coding.problemDetail(id),
    queryFn: () => codingService.getProblem(id),
    enabled: !!id,
  });
}

export function useRunCode() {
  return useMutation({
    mutationFn: (request: ExecutionRequest) => codingService.runCode(request),
    onError: (error: unknown) => {
      handleApiError(error, "Failed to run code");
    }
  });
}

export function useSubmitSolution() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: ExecutionRequest) => codingService.submitSolution(request),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries like stats, history, or recent submissions
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.coding });
      queryClient.invalidateQueries({ queryKey: ["coding-attempt-history", variables.problemId] });
      toast.success("Solution submitted successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to submit solution");
    }
  });
}

export function useCodingAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.coding,
    queryFn: () => codingService.getAnalytics(),
  });
}

export function useAttemptHistory(problemId: string) {
  return useQuery({
    queryKey: ["coding-attempt-history", problemId],
    queryFn: () => codingService.getAttemptHistory(problemId),
    enabled: !!problemId,
  });
}

export function useLearningRecommendations() {
  return useQuery({
    queryKey: queryKeys.analytics.learningHub,
    queryFn: () => codingService.getLearningRecommendations(),
  });
}
