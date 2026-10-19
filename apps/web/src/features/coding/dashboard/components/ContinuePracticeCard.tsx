"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Code2 } from "lucide-react";
import Link from "next/link";
import { Problem } from "@/services/coding/coding.types";
import { Progress } from "@/components/ui/progress";

interface ContinuePracticeCardProps {
  lastProblem: Problem | null;
}

export function ContinuePracticeCard({ lastProblem }: ContinuePracticeCardProps) {
  if (!lastProblem) {
    return (
      <Card className="h-full border-border bg-card/50">
        <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <Code2 className="size-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">No Active Session</h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              You don't have any ongoing problems. Start a new challenge to begin practicing.
            </p>
          </div>
          <Button asChild>
            <Link href="/coding/problems">Browse Problems</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mock completion percentage
  const completionPercentage = 45;

  return (
    <Card className="h-full border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Play className="size-4 text-primary" />
              Continue Practice
            </CardTitle>
            <CardDescription className="mt-1">Resume where you left off</CardDescription>
          </div>
          <div className="px-2.5 py-1 text-xs font-semibold rounded-md bg-background border shadow-sm">
            {lastProblem.difficulty}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-5">
        <div>
          <h3 className="font-bold text-xl line-clamp-1">{lastProblem.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="size-3" />
            Last opened 2 hours ago
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <Button asChild className="w-full">
          <Link href={`/coding/problems/${lastProblem.id}`}>
            Resume Session
            <Play className="ml-2 size-4 fill-current" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
