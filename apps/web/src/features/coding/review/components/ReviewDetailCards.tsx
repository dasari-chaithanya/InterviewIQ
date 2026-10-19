"use client";

import { AIReviewResult } from "../store/use-review-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Sparkles, ShieldAlert, FileText, Code2, TextCursorInput } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeSmellCard({ review }: { review: AIReviewResult }) {
  if (!review.codeSmells.length) return null;

  return (
    <Card className="shadow-sm border-orange-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-orange-600">
          <Bug className="size-4" />
          Code Smells Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {review.codeSmells.map(smell => (
          <div key={smell.id} className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold text-sm mb-1">{smell.type}</div>
              <div className="text-sm text-muted-foreground">{smell.description}</div>
            </div>
            <div className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border shrink-0",
              smell.severity === 'High' || smell.severity === 'Critical' ? "text-red-600 border-red-600/20 bg-red-600/10" :
              smell.severity === 'Medium' ? "text-orange-600 border-orange-600/20 bg-orange-600/10" :
              "text-yellow-600 border-yellow-600/20 bg-yellow-600/10"
            )}>
              {smell.severity}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function OptimizationCard({ review }: { review: AIReviewResult }) {
  return (
    <Card className="shadow-sm border-blue-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-blue-600">
          <Sparkles className="size-4" />
          Optimization Opportunity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Current Approach</div>
            <div className="font-medium text-sm">{review.currentApproach}</div>
          </div>
          <div className="p-3 bg-blue-500/10 border-blue-500/20 rounded-lg border">
            <div className="text-xs font-semibold uppercase text-blue-700 mb-1">Recommended Approach</div>
            <div className="font-medium text-sm text-blue-800">{review.recommendedApproach}</div>
          </div>
        </div>
        <div className="flex gap-4 text-sm pt-2">
          <div className="flex items-center gap-2"><strong className="text-muted-foreground">Runtime:</strong> {review.runtimeImprovement}</div>
          <div className="flex items-center gap-2"><strong className="text-muted-foreground">Memory:</strong> {review.memoryImprovement}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EdgeCaseCard({ review }: { review: AIReviewResult }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldAlert className="size-4 text-purple-500" />
          Edge Cases
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs uppercase font-semibold text-green-600 mb-2">Covered</div>
          <div className="flex flex-wrap gap-2">
            {review.edgeCasesCovered.map((c, i) => <span key={i} className="text-xs bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-1 rounded-md">{c}</span>)}
          </div>
        </div>
        {review.edgeCasesMissing.length > 0 && (
          <div>
            <div className="text-xs uppercase font-semibold text-red-600 mb-2">Missing or Vulnerable</div>
            <div className="flex flex-wrap gap-2">
              {review.edgeCasesMissing.map((c, i) => <span key={i} className="text-xs bg-red-500/10 text-red-700 border border-red-500/20 px-2 py-1 rounded-md">{c}</span>)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ReviewFeedbackCards({ review }: { review: AIReviewResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4" />
            Readability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">{review.readabilityFeedback}</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {review.readabilitySuggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="size-4" />
            Maintainability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">{review.maintainabilityFeedback}</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {review.maintainabilitySuggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
            <TextCursorInput className="size-4" />
            Naming Conventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">{review.namingFeedback}</p>
          <div className="space-y-2">
            {review.namingSuggestions.map((s, i) => (
              <div key={i} className="text-xs p-2 bg-muted/50 rounded-md border">
                <div className="font-mono text-muted-foreground line-through decoration-red-500">{s.from}</div>
                <div className="font-mono font-semibold text-green-600 mb-1">{s.to}</div>
                <div className="text-muted-foreground">{s.reason}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
