"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report/report.service";

export function useAnalyticsKPIs() {
  return useQuery({ queryKey: ["analyticsKPIs"], queryFn: () => reportService.getKPIs() });
}

export function useScoreTrend() {
  return useQuery({ queryKey: ["scoreTrend"], queryFn: () => reportService.getScoreTrend() });
}

export function useTopicStats() {
  return useQuery({ queryKey: ["topicStats"], queryFn: () => reportService.getTopicStats() });
}

export function useAchievements() {
  return useQuery({ queryKey: ["achievements"], queryFn: () => reportService.getAchievements() });
}

export function useHeatmap() {
  return useQuery({ queryKey: ["heatmap"], queryFn: () => reportService.getHeatmap() });
}

export function useCompanyReadiness() {
  return useQuery({ queryKey: ["companyReadiness"], queryFn: () => reportService.getCompanyReadiness() });
}

export function useRoleReadiness() {
  return useQuery({ queryKey: ["roleReadiness"], queryFn: () => reportService.getRoleReadiness() });
}

export function useAICoachData() {
  return useQuery({ queryKey: ["aiCoachData"], queryFn: () => reportService.getAICoachData() });
}
