"use client";

import { ImprovementSuggestion, ReadinessTopic } from "@/services/resume/resume-analysis.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Target, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function InsightsAndSuggestions({ improvements, readiness, insights }: { improvements: ImprovementSuggestion[], readiness: ReadinessTopic[], insights: string[] }) {
  return (
    <div className="space-y-6">
      
      {/* AI Insights Summary */}
      <Card className="bg-primary/5 border-primary/20 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-primary">
            <Lightbulb className="size-5" /> Executive Summary
          </h3>
          <ul className="space-y-3">
            {insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowUpCircle className="size-3.5 text-primary" />
                </div>
                <span className="text-sm leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Interview Readiness */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="size-5 text-primary" /> Readiness by Topic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {readiness.map((topic, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{topic.topic}</span>
                <span className="text-muted-foreground">{topic.score}%</span>
              </div>
              <Progress value={topic.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actionable Improvements */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Actionable Suggestions</h3>
        <div className="grid grid-cols-1 gap-4">
          {improvements.map(imp => (
            <Card key={imp.id} className="border-border shadow-sm hover:border-primary/50 transition-colors">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-semibold">
                    {imp.category}
                  </Badge>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className={
                      imp.priority === "High" ? "bg-red-500/10 text-red-600 hover:bg-red-500/20" : ""
                    }>
                      {imp.priority} Priority
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">{imp.whyItMatters}</p>
                  <p className="text-sm text-muted-foreground">{imp.suggestion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
