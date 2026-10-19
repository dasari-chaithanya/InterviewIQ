"use client";

import { useCodingStats } from "../hooks/use-coding";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Flame, Trophy, Code2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CodingDashboard() {
  const { data: analytics, isLoading } = useCodingStats();

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Primary Action & Streaks */}
      <Card className="md:col-span-2 border-primary/20 bg-primary/5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Code2 className="size-48" />
        </div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <Code2 className="size-6" />
            Continue Practice
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pick up where you left off or tackle the daily challenge.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10 pt-4">
          <div className="flex gap-4">
            <Button asChild className="bg-primary flex-1">
              <Link href="/coding/two-sum">
                <Play className="size-4 mr-2" /> Resume "Two Sum"
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              View Daily Challenge
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-primary/10">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Flame className="size-3 text-orange-500" /> Current Streak
              </span>
              <p className="text-xl font-bold">{analytics.stats.currentStreak} Days</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Trophy className="size-3 text-yellow-500" /> Longest Streak
              </span>
              <p className="text-xl font-bold">{analytics.stats.longestStreak} Days</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Target className="size-3 text-green-500" /> Acceptance Rate
              </span>
              <p className="text-xl font-bold">{analytics.stats.acceptanceRate}%</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Code2 className="size-3 text-blue-500" /> Total Solved
              </span>
              <p className="text-xl font-bold">{analytics.stats.totalSolved}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Progress */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Difficulty Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-500 font-medium">Easy</span>
              <span className="font-bold">{analytics.stats.easySolved}</span>
            </div>
            <Progress value={(analytics.stats.easySolved / 300) * 100} className="h-2 [&>div]:bg-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-yellow-500 font-medium">Medium</span>
              <span className="font-bold">{analytics.stats.mediumSolved}</span>
            </div>
            <Progress value={(analytics.stats.mediumSolved / 500) * 100} className="h-2 [&>div]:bg-yellow-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-500 font-medium">Hard</span>
              <span className="font-bold">{analytics.stats.hardSolved}</span>
            </div>
            <Progress value={(analytics.stats.hardSolved / 200) * 100} className="h-2 [&>div]:bg-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
