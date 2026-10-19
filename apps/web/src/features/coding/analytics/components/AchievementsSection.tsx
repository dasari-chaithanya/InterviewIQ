"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Flame, Target, Zap, MemoryStick, Map, BrainCircuit } from "lucide-react";

export function AchievementsSection() {
  const achievements = [
    { title: "100 Problems Solved", desc: "Completed 100 coding problems.", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "7-Day Streak", desc: "Maintained a 7-day coding streak.", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "First Hard Problem", desc: "Successfully solved a hard problem.", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "DP Master", desc: "Solved 20 Dynamic Programming problems.", icon: BrainCircuit, color: "text-pink-500", bg: "bg-pink-500/10" },
    { title: "Graph Explorer", desc: "Mastered basic graph traversal.", icon: Map, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Speed Demon", desc: "Beat 90% in runtime on 10 problems.", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="size-4 text-primary" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        {achievements.map((ach, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border bg-muted/30">
            <div className={`p-2 rounded-full shrink-0 ${ach.bg} ${ach.color}`}>
              <ach.icon className="size-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">{ach.title}</div>
              <div className="text-xs text-muted-foreground leading-snug">{ach.desc}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function MilestonesTimeline() {
  const milestones = [
    { title: "First Perfect Score", date: "2 days ago", type: "score" },
    { title: "First Accepted Hard", date: "1 week ago", type: "hard" },
    { title: "100 Problems", date: "2 weeks ago", type: "milestone" },
    { title: "50 Problems", date: "1 month ago", type: "milestone" },
    { title: "First Submission", date: "2 months ago", type: "start" },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Milestones</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[0.6rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border bg-background shrink-0 z-10 border-primary" />
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] text-sm">
                <div className="font-semibold">{m.title}</div>
                <div className="text-xs text-muted-foreground">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
