"use client";

import { useCodingAnalytics, useAttemptHistory, useProblems } from "@/services/coding/use-coding";
import { CodingDashboardHeader } from "@/features/coding/dashboard/components/CodingDashboardHeader";
import { CodingKpiCards } from "@/features/coding/dashboard/components/CodingKpiCards";
import { ContinuePracticeCard } from "@/features/coding/dashboard/components/ContinuePracticeCard";
import { RecommendedProblemsCard } from "@/features/coding/dashboard/components/RecommendedProblemsCard";
import { WeeklyGoalCard } from "@/features/coding/dashboard/components/WeeklyGoalCard";
import { TopicProgressCard } from "@/features/coding/dashboard/components/TopicProgressCard";
import { RecentActivityCard } from "@/features/coding/dashboard/components/RecentActivityCard";
import { AchievementsPreviewCard } from "@/features/coding/dashboard/components/AchievementsPreviewCard";
import { CodingQuickActions } from "@/features/coding/dashboard/components/CodingQuickActions";
import { DashboardSkeleton, DashboardEmptyState } from "@/features/coding/dashboard/components/DashboardSkeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function CodingDashboardPage() {
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useCodingAnalytics();
  const { data: history, isLoading: historyLoading } = useAttemptHistory("all"); // Mock 'all' for recent activity
  const { data: problems, isLoading: problemsLoading } = useProblems();

  const isLoading = analyticsLoading || historyLoading || problemsLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <DashboardSkeleton />
      </div>
    );
  }

  if (analyticsError || !analytics) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load coding dashboard data. Please try again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetchAnalytics()}>Retry</Button>
      </div>
    );
  }

  // Find last attempted problem for the Continue Practice card
  const lastAttemptedId = history && history.length > 0 ? history[0].problemId : null;
  const lastProblem = lastAttemptedId && problems ? problems.find(p => p.id === lastAttemptedId) || null : null;

  // Mock recommendations (unsolved problems)
  const recommendations = problems ? problems.filter(p => p.status !== "Solved").slice(0, 4) : [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 pb-16">
      <CodingDashboardHeader stats={analytics.stats} />
      
      <CodingKpiCards stats={analytics.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContinuePracticeCard lastProblem={lastProblem} />
            <WeeklyGoalCard />
          </div>
          
          <RecommendedProblemsCard problems={recommendations} />
          
          <CodingQuickActions />
        </div>

        {/* Right Column - Side Panel */}
        <div className="space-y-6">
          <TopicProgressCard topics={analytics.topicProgress} />
          <RecentActivityCard activity={history || []} />
          <AchievementsPreviewCard achievements={analytics.achievements} />
        </div>
      </div>
    </div>
  );
}
