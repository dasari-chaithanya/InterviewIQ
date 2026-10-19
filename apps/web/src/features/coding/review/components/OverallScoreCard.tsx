"use client";

import { AIReviewResult } from "../store/use-review-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

interface OverallScoreCardProps {
  review: AIReviewResult;
}

export function OverallScoreCard({ review }: OverallScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-500/10";
    if (score >= 75) return "bg-blue-500/10";
    if (score >= 60) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  const scores = [
    { label: "Correctness", value: review.correctnessScore },
    { label: "Code Quality", value: review.codeQualityScore },
    { label: "Readability", value: review.readabilityScore },
    { label: "Maintainability", value: review.maintainabilityScore },
    { label: "Performance", value: review.performanceScore },
    { label: "Best Practices", value: review.bestPracticesScore },
  ];

  return (
    <Card className="shadow-sm border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BrainCircuit className="size-5 text-purple-500" />
          Overall AI Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`size-32 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(review.overallScore)} ${getScoreBgColor(review.overallScore)} border-current`}
          >
            <span className="text-4xl font-bold font-mono">{review.overallScore}</span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80 mt-1">/ 100</span>
          </motion.div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
            {scores.map((score, idx) => (
              <motion.div 
                key={score.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{score.label}</span>
                  <span className={`text-xs font-bold font-mono ${getScoreColor(score.value)}`}>{score.value}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score.value}%` }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                    className={`h-full ${getScoreBgColor(score.value).replace('/10', '')} bg-current opacity-50`} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
