"use client";

import { AICoachData } from "@/services/report/report.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Target, TrendingUp, TrendingDown, Play, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AICoachDashboardProps {
  data?: AICoachData;
  isLoading: boolean;
}

export function AICoachDashboard({ data, isLoading }: AICoachDashboardProps) {
  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Primary Coach Action */}
      <Card className="lg:col-span-2 border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BrainCircuit className="size-48" />
        </div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <BrainCircuit className="size-6" />
            AI Coach Recommendations
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your recent performance, here is what you should focus on today.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10 pt-4">
          {data.practiceToday.map((rec, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card items-start sm:items-center justify-between shadow-sm transition-all hover:shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={rec.priority === "High" ? "destructive" : "secondary"}>
                    {rec.priority} Priority
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{rec.type}</span>
                </div>
                <h4 className="font-semibold text-base">{rec.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{rec.description}</p>
              </div>
              <Link 
                href={rec.actionHref}
                className={cn(buttonVariants({ variant: rec.type === "Practice" ? "default" : "secondary" }), "shrink-0 w-full sm:w-auto")}
              >
                {rec.type === "Practice" && <Play className="size-4 mr-2" />}
                {rec.type === "Review" && <FileText className="size-4 mr-2" />}
                {rec.actionLabel}
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress & Highlights */}
      <div className="space-y-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Target className="size-5 text-primary" /> Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Weekly Goal</span>
                <span>{data.weeklyGoalProgress}%</span>
              </div>
              <Progress value={data.weeklyGoalProgress} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Monthly Goal</span>
                <span>{data.monthlyGoalProgress}%</span>
              </div>
              <Progress value={data.monthlyGoalProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="size-5 text-green-500" /> Recent Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <TrendingUp className="size-3.5 text-green-500" /> Improving
              </h5>
              <div className="flex flex-wrap gap-2">
                {data.improvedTopics.map(t => (
                  <Badge key={t} variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">{t}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <TrendingDown className="size-3.5 text-red-500" /> Declining
              </h5>
              <div className="flex flex-wrap gap-2">
                {data.declinedTopics.map(t => (
                  <Badge key={t} variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">{t}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
