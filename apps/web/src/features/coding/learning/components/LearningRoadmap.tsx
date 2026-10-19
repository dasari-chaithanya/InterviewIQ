"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, Map, Compass, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function LearningRoadmap() {
  const steps = [
    { title: "Sliding Window", status: "completed", time: "Mastered" },
    { title: "Binary Search", status: "current", time: "Current Focus" },
    { title: "Graphs", status: "next", time: "Est. 2 Weeks" },
    { title: "Dynamic Programming", status: "locked", time: "Est. 3 Weeks" },
    { title: "System Design", status: "locked", time: "Est. 4 Weeks" },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Map className="size-4" />
          Personalized Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex items-center justify-center size-8 rounded-full border-2",
                  step.status === 'completed' ? "bg-green-500 border-green-500 text-white" :
                  step.status === 'current' ? "bg-background border-primary text-primary" :
                  "bg-muted border-transparent text-muted-foreground"
                )}>
                  {step.status === 'completed' && <CheckCircle2 className="size-5" />}
                  {step.status === 'current' && <Compass className="size-4 animate-pulse" />}
                  {step.status !== 'completed' && step.status !== 'current' && <Lock className="size-4" />}
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-8 my-1",
                    step.status === 'completed' ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </div>
              <div className="pt-1 pb-4">
                <div className={cn(
                  "font-semibold",
                  step.status === 'current' ? "text-primary" :
                  step.status === 'completed' ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
