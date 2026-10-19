"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Trophy, Lock } from "lucide-react";

export function LearningInsightsCard() {
  const insights = [
    { text: "You struggle with Dynamic Programming on Medium difficulty.", type: "negative" },
    { text: "Runtime has improved 24% over the last week.", type: "positive" },
    { text: "Memory usage is slowly improving but can be optimized.", type: "neutral" },
    { text: "Graph traversal questions remain weak.", type: "negative" },
    { text: "You solve Array problems exceptionally fast.", type: "positive" },
  ];

  return (
    <Card className="shadow-sm h-full border-purple-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-purple-600">
          <Sparkles className="size-4" />
          AI Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3 text-sm">
            <div className={`mt-0.5 size-2 rounded-full shrink-0 ${
              insight.type === 'positive' ? 'bg-green-500' :
              insight.type === 'negative' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <span className="leading-snug">{insight.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AchievementsCard() {
  const achievements = [
    { title: "7-Day Streak", unlocked: true },
    { title: "Speed Demon", unlocked: true },
    { title: "Graph Explorer", unlocked: false },
    { title: "First Hard", unlocked: false },
    { title: "DP Master", unlocked: false },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="size-4 text-yellow-500" />
          Achievements Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 grid grid-cols-2 gap-3">
        {achievements.map((ach, idx) => (
          <div key={idx} className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-medium ${
            ach.unlocked ? "bg-yellow-500/10 border-yellow-500/30 text-foreground" : "bg-muted/50 text-muted-foreground opacity-60"
          }`}>
            {ach.unlocked ? <Trophy className="size-3 text-yellow-500" /> : <Lock className="size-3" />}
            <span className="truncate">{ach.title}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
