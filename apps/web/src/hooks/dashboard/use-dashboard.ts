"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard/dashboard.service";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardService.getSummary(),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
  });
}

export function useRecentInterviews() {
  return useQuery({
    queryKey: ["dashboard", "recent-interviews"],
    queryFn: () => dashboardService.getRecentInterviews(),
  });
}

export function useContinuePractice() {
  return useQuery({
    queryKey: ["dashboard", "continue-practice"],
    queryFn: () => dashboardService.getContinuePractice(),
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["dashboard", "recommendations"],
    queryFn: () => dashboardService.getRecommendations(),
  });
}

export function useGoals() {
  return useQuery({
    queryKey: ["dashboard", "goals"],
    queryFn: () => dashboardService.getGoals(),
  });
}

export function useAnalyticsPreview() {
  return useQuery({
    queryKey: ["dashboard", "analytics-preview"],
    queryFn: () => dashboardService.getAnalyticsPreview(),
  });
}
