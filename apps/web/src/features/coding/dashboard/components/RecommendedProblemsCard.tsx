"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bookmark, ArrowRight, Clock, Target } from "lucide-react";
import Link from "next/link";
import { Problem } from "@/services/coding/coding.types";
import { Badge } from "@/components/ui/badge";

interface RecommendedProblemsCardProps {
  problems: Problem[];
}

export function RecommendedProblemsCard({ problems }: RecommendedProblemsCardProps) {
  const displayProblems = problems.slice(0, 4);

  return (
    <Card className="h-full border-border shadow-sm flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="size-5 text-yellow-500" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="divide-y divide-border/50 flex-1">
          {displayProblems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No recommendations available at this time.
            </div>
          ) : (
            displayProblems.map((problem, i) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 group hover:bg-muted/30 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {problem.title}
                    </h4>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      problem.difficulty === "Easy" ? "text-green-600 border-green-600/20 bg-green-600/10" :
                      problem.difficulty === "Medium" ? "text-orange-600 border-orange-600/20 bg-orange-600/10" :
                      "text-red-600 border-red-600/20 bg-red-600/10"
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {problem.estimatedTime}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="size-3" />
                      {problem.acceptanceRate.toFixed(1)}%
                    </span>
                    <span className="hidden sm:inline-block truncate">
                      {problem.topics.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                    <Bookmark className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                    <Link href={`/coding/problems/${problem.id}`}>
                      Solve <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-border mt-auto">
          <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-foreground" asChild>
            <Link href="/coding/problems?filter=recommended">
              View All Recommendations
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
