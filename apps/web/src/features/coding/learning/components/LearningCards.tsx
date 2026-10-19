"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WeakTopicsCard() {
  const weakTopics = [
    { name: "Dynamic Programming", current: 40, target: 80, count: 12 },
    { name: "Graphs", current: 45, target: 75, count: 8 },
    { name: "Trees", current: 60, target: 85, count: 5 },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-orange-500">
          <AlertTriangle className="size-4" />
          Weak Topics Identified
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {weakTopics.map((topic, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{topic.name}</span>
              <span className="text-xs text-muted-foreground">{topic.count} practice problems</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-orange-500" style={{ width: `${topic.current}%` }} />
                <div className="h-full bg-orange-500/30 border-l border-background" style={{ width: `${topic.target - topic.current}%` }} />
              </div>
              <span className="text-xs font-mono w-16 text-right">{topic.current} → {topic.target}</span>
            </div>
          </div>
        ))}
        <div className="pt-2">
          <Button variant="outline" className="w-full text-xs" size="sm">
            View Targeted Practice Set <ArrowRight className="size-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecommendedProblemsCard() {
  const problems = [
    { title: "Coin Change", diff: "Medium", time: "25m", reason: "Addresses your weakness in DP" },
    { title: "Course Schedule", diff: "Medium", time: "30m", reason: "Graph traversal practice" },
    { title: "Binary Tree Level Order", diff: "Medium", time: "20m", reason: "Tree BFS reinforcement" },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-primary">
          <Lightbulb className="size-4" />
          Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {problems.map((p, i) => (
          <div key={i} className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4">
            <div className="space-y-1 overflow-hidden">
              <div className="font-medium text-sm truncate">{p.title}</div>
              <div className="text-[10px] text-muted-foreground uppercase flex gap-2">
                <span className="text-orange-500 font-semibold">{p.diff}</span>
                <span>•</span>
                <span>{p.time}</span>
              </div>
              <div className="text-xs text-primary/80 truncate">{p.reason}</div>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
              <Play className="size-4 fill-current ml-0.5" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
