"use client";

import { motion } from "framer-motion";
import { Problem } from "@/services/coding/coding.types";
import { Target, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProblemMetadataProps {
  problem: Problem;
}

export function ProblemMetadata({ problem }: ProblemMetadataProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-center gap-4 text-sm mt-4 border-b pb-6"
    >
      <span className={cn(
        "font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border",
        problem.difficulty === "Easy" ? "text-green-600 border-green-600/20 bg-green-600/10" :
        problem.difficulty === "Medium" ? "text-orange-600 border-orange-600/20 bg-orange-600/10" :
        "text-red-600 border-red-600/20 bg-red-600/10"
      )}>
        {problem.difficulty}
      </span>

      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border">
        <Target className="size-4" />
        <span className="font-medium">Acceptance: {problem.acceptanceRate.toFixed(1)}%</span>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border">
        <Clock className="size-4" />
        <span className="font-medium">Est. Time: {problem.estimatedTime}m</span>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border">
        <Activity className="size-4" />
        <span className="font-medium">Total Attempts: 14.5K</span>
      </div>
    </motion.div>
  );
}
