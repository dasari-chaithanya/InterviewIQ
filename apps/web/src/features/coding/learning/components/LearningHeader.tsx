"use client";

import { Brain, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LearningHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <GraduationCap className="size-8 text-primary" />
          AI Learning Hub
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Your personalized coaching dashboard. Translating your submission history and AI reviews into a concrete path to mastery.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Brain className="size-4 mr-2" /> Start Guided Practice
        </Button>
      </div>
    </div>
  );
}
