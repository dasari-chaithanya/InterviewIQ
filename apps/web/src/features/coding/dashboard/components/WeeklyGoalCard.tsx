"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function WeeklyGoalCard() {
  // Mock data as requested
  const goal = 15;
  const solved = 11;
  const percentage = Math.round((solved / goal) * 100);
  
  return (
    <Card className="h-full border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            Weekly Goal
          </div>
          <span className="text-sm font-normal text-muted-foreground">{solved} / {goal} Solved</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Progress</span>
            <span className="text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-3 border border-border/50">
          <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
            <TrendingUp className="size-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">You're on track!</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Solve {goal - solved} more problems this week to hit your target. Keep up the great momentum!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
