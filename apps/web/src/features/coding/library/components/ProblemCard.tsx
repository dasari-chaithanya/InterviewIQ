"use client";

import { motion } from "framer-motion";
import { Problem } from "@/services/coding/coding.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Target } from "lucide-react";
import Link from "next/link";
import { ProblemStatusBadge } from "./ProblemStatusBadge";
import { ProblemDifficultyBadge } from "./ProblemDifficultyBadge";
import { ProblemTopicTags } from "./ProblemTopicTags";
import { ProblemCompanyTags } from "./ProblemCompanyTags";
import { FavoriteButton } from "./FavoriteButton";

interface ProblemCardProps {
  problem: Problem;
  index: number;
}

export function ProblemCard({ problem, index }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="overflow-hidden hover:border-primary/30 transition-colors group">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              <div className="mt-1 shrink-0">
                <ProblemStatusBadge status={problem.status} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                  {problem.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <ProblemDifficultyBadge difficulty={problem.difficulty} />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Target className="size-3" /> {problem.acceptanceRate.toFixed(1)}%
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {problem.estimatedTime}m
                  </span>
                </div>
              </div>
            </div>
            <FavoriteButton isFavorite={problem.isFavorite} problemId={problem.id} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">Topics</span>
              <ProblemTopicTags topics={problem.topics} maxDisplay={3} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">Companies</span>
              <ProblemCompanyTags companies={problem.companies} maxDisplay={3} />
            </div>
          </div>

          <Button className="w-full mt-2" asChild>
            <Link href={`/coding/problems/${problem.id}`}>
              <Play className="mr-2 size-4 fill-current" />
              Start Solving
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
