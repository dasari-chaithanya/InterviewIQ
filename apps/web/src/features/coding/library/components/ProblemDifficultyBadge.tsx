"use client";

import { cn } from "@/lib/utils";

interface ProblemDifficultyBadgeProps {
  difficulty: "Easy" | "Medium" | "Hard";
}

export function ProblemDifficultyBadge({ difficulty }: ProblemDifficultyBadgeProps) {
  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap",
      difficulty === "Easy" ? "text-green-600 border-green-600/20 bg-green-600/10" :
      difficulty === "Medium" ? "text-orange-600 border-orange-600/20 bg-orange-600/10" :
      "text-red-600 border-red-600/20 bg-red-600/10"
    )}>
      {difficulty}
    </span>
  );
}
