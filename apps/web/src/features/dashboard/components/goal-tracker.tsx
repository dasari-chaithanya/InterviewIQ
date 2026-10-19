"use client";

import { useGoals } from "@/hooks/dashboard/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

export function GoalTracker() {
  const { data: goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Your Goals</CardTitle>
        <CardDescription>Track your practice consistency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals && goals.length > 0 ? (
          goals.map((goal) => {
            const isCompleted = goal.completed >= goal.total;
            const progress = Math.min((goal.completed / goal.total) * 100, 100);

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm font-medium leading-none">{goal.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {goal.completed} / {goal.total}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No active goals. Set some up to stay on track!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
