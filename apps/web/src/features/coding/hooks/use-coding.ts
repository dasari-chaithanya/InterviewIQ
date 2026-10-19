"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { codingService } from "@/services/coding/coding.service";
import { Language, TestCase } from "@/services/coding/coding.types";

export function useProblems() {
  return useQuery({
    queryKey: ["coding-problems"],
    queryFn: () => codingService.getProblems(),
  });
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: ["coding-problem", id],
    queryFn: () => codingService.getProblem(id),
    enabled: !!id,
  });
}

export function useTestCases(problemId: string) {
  return useQuery({
    queryKey: ["coding-test-cases", problemId],
    // Test cases logic was removed or mock only, let's keep it null if backend doesn't support
    queryFn: () => Promise.resolve([] as TestCase[]),
    enabled: !!problemId,
  });
}

export function useCodingStats() {
  return useQuery({
    queryKey: ["coding-stats"],
    queryFn: () => codingService.getAnalytics(),
  });
}

export function useRunCode() {
  return useMutation({
    mutationFn: ({ problemId, code, language }: { problemId: string; code: string; language: Language }) => 
      codingService.runCode({ problemId, code, language }),
  });
}

export function useSubmitCode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ problemId, code, language }: { problemId: string; code: string; language: Language }) => 
      codingService.submitSolution({ problemId, code, language }),
    onSuccess: () => {
      // Invalidate relevant queries like stats or recent submissions
      queryClient.invalidateQueries({ queryKey: ["coding-stats"] });
    }
  });
}
