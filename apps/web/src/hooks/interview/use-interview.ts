"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewService } from "@/services/interview/interview.service";
import { InterviewConfiguration } from "@/services/interview/interview.types";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/api.errors";
import { queryKeys } from "@/lib/api/query.keys";
import { useRouter } from "next/navigation";

export function useRecentSessions() {
  return useQuery({
    queryKey: queryKeys.interviews.all,
    queryFn: () => interviewService.getRecentSessions(),
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: queryKeys.interviews.detail(id),
    queryFn: () => interviewService.getSession(id),
    enabled: !!id,
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["interviewRecommendations"],
    queryFn: () => interviewService.getRecommendations(),
  });
}

export function useInterviewStatistics() {
  return useQuery({
    queryKey: ["interviewStatistics"],
    queryFn: () => interviewService.getStatistics(),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (config: InterviewConfiguration) => interviewService.createSession(config),
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all });
      // Route to the actual interview engine.
      router.push(`/interview/${newSession.id}`);
      toast.success("Interview session ready!");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to generate interview. Please try again.");
    }
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => interviewService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all });
      toast.success("Session deleted");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to delete session");
    }
  });
}
