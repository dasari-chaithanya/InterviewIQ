"use client";

import { motion } from "framer-motion";
import { Problem } from "@/services/coding/coding.types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RelatedProblemsProps {
  currentProblemId: string;
  problems: Problem[];
}

export function RelatedProblems({ currentProblemId, problems }: RelatedProblemsProps) {
  // Mock logic: randomly select 3 problems excluding current
  const related = problems
    .filter(p => p.id !== currentProblemId)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-4 mt-10 border-t pt-8"
    >
      <h3 className="text-xl font-bold">Related Problems</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((problem, i) => (
          <Card key={problem.id} className="group hover:border-primary/40 transition-colors">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {problem.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                  problem.difficulty === "Easy" ? "text-green-600 border-green-600/20 bg-green-600/10" :
                  problem.difficulty === "Medium" ? "text-orange-600 border-orange-600/20 bg-orange-600/10" :
                  "text-red-600 border-red-600/20 bg-red-600/10"
                )}>
                  {problem.difficulty}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Target className="size-3" /> {problem.acceptanceRate.toFixed(1)}%
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {problem.estimatedTime}m
                </span>
              </div>
              <Link 
                href={`/coding/problems/${problem.id}`}
                className="text-xs text-primary font-medium flex items-center hover:underline pt-1"
              >
                View Details <ArrowRight className="ml-1 size-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
