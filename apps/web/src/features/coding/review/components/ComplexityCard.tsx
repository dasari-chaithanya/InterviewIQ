"use client";

import { AIReviewResult } from "../store/use-review-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComplexityCard({ review }: { review: AIReviewResult }) {
  const isTimeOptimal = review.detectedTimeComplexity === review.expectedTimeComplexity;
  const isSpaceOptimal = review.detectedSpaceComplexity === review.expectedSpaceComplexity;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Cpu className="size-4 text-blue-500" />
          Complexity Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-3 rounded-lg bg-muted/50 border">
            <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1.5">
              Time Complexity
              {isTimeOptimal ? <CheckCircle2 className="size-3 text-green-500" /> : <AlertTriangle className="size-3 text-orange-500" />}
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("font-mono font-bold text-lg", isTimeOptimal ? "text-green-600" : "text-orange-600")}>
                {review.detectedTimeComplexity}
              </span>
              {!isTimeOptimal && (
                <>
                  <ArrowRight className="size-3 text-muted-foreground" />
                  <span className="font-mono text-sm text-green-600 font-medium">Expected {review.expectedTimeComplexity}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2 p-3 rounded-lg bg-muted/50 border">
            <div className="text-xs uppercase font-semibold text-muted-foreground flex items-center gap-1.5">
              Space Complexity
              {isSpaceOptimal ? <CheckCircle2 className="size-3 text-green-500" /> : <AlertTriangle className="size-3 text-orange-500" />}
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("font-mono font-bold text-lg", isSpaceOptimal ? "text-green-600" : "text-orange-600")}>
                {review.detectedSpaceComplexity}
              </span>
              {!isSpaceOptimal && (
                <>
                  <ArrowRight className="size-3 text-muted-foreground" />
                  <span className="font-mono text-sm text-green-600 font-medium">Expected {review.expectedSpaceComplexity}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {(!isTimeOptimal || !isSpaceOptimal) && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-700">
            <span className="font-semibold mr-1">AI Suggestion:</span> 
            {review.complexityOptimization}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
