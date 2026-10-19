"use client";

import { AIComplexityAnalysis as ComplexityType } from "../services/coding.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, HardDrive, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIComplexityAnalysis({ complexity }: { complexity: ComplexityType }) {
  const isTimeOptimal = complexity.detectedTime === complexity.expectedTime;
  const isSpaceOptimal = complexity.detectedSpace === complexity.expectedSpace;

  return (
    <Card className="border-primary/10 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          AI Complexity Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Time Complexity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Time Complexity</h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Expected</span>
              <div className="px-3 py-1 bg-muted rounded-md font-mono text-sm border">
                {complexity.expectedTime}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Detected</span>
              <div className={cn(
                "px-3 py-1 rounded-md font-mono text-sm border flex items-center gap-2",
                isTimeOptimal ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"
              )}>
                {complexity.detectedTime}
                {isTimeOptimal ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg border">
            {complexity.timeExplanation}
          </p>
        </div>

        {/* Space Complexity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="size-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Space Complexity</h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Expected</span>
              <div className="px-3 py-1 bg-muted rounded-md font-mono text-sm border">
                {complexity.expectedSpace}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground block">Detected</span>
              <div className={cn(
                "px-3 py-1 rounded-md font-mono text-sm border flex items-center gap-2",
                isSpaceOptimal ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"
              )}>
                {complexity.detectedSpace}
                {isSpaceOptimal ? <CheckCircle2 className="size-3" /> : <AlertTriangle className="size-3" />}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg border">
            {complexity.spaceExplanation}
          </p>
        </div>

      </CardContent>
    </Card>
  );
}
