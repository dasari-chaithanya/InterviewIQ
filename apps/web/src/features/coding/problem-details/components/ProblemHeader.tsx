"use client";

import { motion } from "framer-motion";
import { Problem } from "@/services/coding/coding.types";
import { BookmarkButton } from "./BookmarkButton";
import { ArrowLeft, CheckCircle2, Clock, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProblemHeaderProps {
  problem: Problem;
}

export function ProblemHeader({ problem }: ProblemHeaderProps) {
  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground -ml-2 mb-2">
          <Link href="/coding/problems">
            <ArrowLeft className="mr-2 size-4" />
            Back to Library
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-start justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{problem.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}. {problem.title}</h1>
            {problem.status === "Solved" && (
              <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-sm font-medium">
                <CheckCircle2 className="size-4" />
                Solved
              </div>
            )}
            {problem.status === "Attempted" && (
              <div className="flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md text-sm font-medium">
                <Clock className="size-4" />
                Attempted
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <BookmarkButton isBookmarked={problem.isFavorite} problemId={problem.id} withText />
          {/* Phase 5 triggers the workspace */}
          <Button size="default" className="shadow-sm" asChild>
            <Link href={`/coding/workspace/${problem.id}`}>
              <Play className="mr-2 size-4 fill-current" />
              Start Solving
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
