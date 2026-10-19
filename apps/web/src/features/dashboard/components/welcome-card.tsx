"use client";

import { useDashboardSummary } from "@/hooks/dashboard/use-dashboard";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Target, Trophy } from "lucide-react";

export function WelcomeCard() {
  const { user } = useAuth();
  const { data: summary, isLoading } = useDashboardSummary();

  if (isLoading || !summary) {
    return <Skeleton className="h-[120px] w-full rounded-xl" />;
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
      
      <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h2>
          <p className="text-muted-foreground text-sm">
            You&apos;re doing great. Keep up the momentum to reach your goals.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center text-orange-500 gap-1.5">
              <Flame className="size-5" />
              <span className="font-bold text-xl leading-none">{summary.streak}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Day Streak</span>
          </div>

          <div className="w-px h-10 bg-border shrink-0" />

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center text-blue-500 gap-1.5">
              <Target className="size-5" />
              <span className="font-bold text-xl leading-none">{summary.practiceGoal.current}/{summary.practiceGoal.target}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Goal</span>
          </div>

          <div className="w-px h-10 bg-border shrink-0 hidden sm:block" />

          <div className="hidden sm:flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center text-green-500 gap-1.5">
              <Trophy className="size-5" />
              <span className="font-bold text-xl leading-none">{summary.overallScore ?? "N/A"}</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
