"use client";

import { AIReviewResult } from "../store/use-review-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ThumbsUp, ThumbsDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function StrengthsWeaknessesCard({ review }: { review: AIReviewResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="shadow-sm border-green-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-green-600">
            <ThumbsUp className="size-4" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {review.strengths.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <CheckCircleIcon className="size-4 text-green-500 shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-red-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-red-600">
            <ThumbsDown className="size-4" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {review.weaknesses.map((w, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <XCircleIcon className="size-4 text-red-500 shrink-0 mt-0.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function SuggestionCard({ review }: { review: AIReviewResult }) {
  if (!review.topSuggestions.length) return null;

  return (
    <Card className="shadow-sm border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-primary">
          <Lightbulb className="size-4" />
          Top Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {review.topSuggestions.map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={s.id} 
            className="p-4 rounded-lg bg-muted/50 border space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="font-semibold text-sm">{s.description}</div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border",
                  s.priority === 'High' ? "text-red-600 border-red-600/20 bg-red-600/10" :
                  s.priority === 'Medium' ? "text-orange-600 border-orange-600/20 bg-orange-600/10" :
                  "text-blue-600 border-blue-600/20 bg-blue-600/10"
                )}>
                  {s.priority} Priority
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
                  {s.difficulty} Fix
                </span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground flex items-center gap-2 bg-background p-2 rounded border border-dashed">
              <span className="font-semibold text-primary shrink-0">Estimated Gain:</span>
              {s.estimatedImprovement}
            </div>
            
            <div className="mt-2 text-sm">
              <div className="text-xs text-muted-foreground mb-1">Example Approach:</div>
              <div className="font-mono bg-black/5 dark:bg-white/5 p-2 rounded text-xs overflow-x-auto whitespace-pre">
                {s.example}
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
}

function XCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
}
