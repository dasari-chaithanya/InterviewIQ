"use client";

import { AIReviewResult } from "../../review/store/use-review-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Quote } from "lucide-react";

export function AIReviewSummary({ review }: { review: AIReviewResult }) {
  return (
    <Card className="shadow-sm border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-primary">
          <Brain className="size-4" />
          AI Principal Engineer Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Quote className="absolute -top-1 -left-2 size-8 text-primary/10 rotate-180" />
          <p className="relative z-10 text-sm leading-relaxed pl-4 border-l-2 border-primary/30 text-muted-foreground font-medium">
            Overall, a solid attempt. {review.strengths[0]} is apparent, but you are currently being held back by {review.weaknesses[0].toLowerCase()}. 
            I highly recommend focusing on {review.topSuggestions[0]?.description.toLowerCase() || 'general optimization'} for your next iteration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OptimizationRoadmap({ review }: { review: AIReviewResult }) {
  if (!review.topSuggestions.length) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Optimization Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {review.topSuggestions.map((s, i) => (
          <div key={s.id} className="p-4 rounded-lg bg-muted/50 border flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <span className="font-semibold text-sm">{i + 1}. {s.description}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-background border rounded-full shrink-0">
                {s.difficulty}
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex gap-4">
              <span><strong className="text-foreground">Impact:</strong> {s.estimatedImprovement}</span>
              <span><strong className="text-foreground">Category:</strong> {s.category}</span>
            </div>
            <div className="text-xs font-mono bg-background p-2 rounded border border-dashed">
              {s.example}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
