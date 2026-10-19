"use client";

import { useState } from "react";
import { QuestionResult } from "@/services/report/report.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ChevronDown, ChevronUp, Clock, CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const gradeConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  Excellent: { color: "text-green-600 bg-green-500/10 border-green-500/30", icon: CheckCircle2 },
  Good: { color: "text-blue-600 bg-blue-500/10 border-blue-500/30", icon: CheckCircle2 },
  "Needs Improvement": { color: "text-orange-600 bg-orange-500/10 border-orange-500/30", icon: AlertTriangle },
  Weak: { color: "text-red-600 bg-red-500/10 border-red-500/30", icon: XCircle },
  Skipped: { color: "text-muted-foreground bg-muted border-muted", icon: XCircle },
};

export function QuestionReview({ results }: { results: QuestionResult[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">Question-by-Question Review</CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-border">
        {results.map((q, index) => {
          const isExpanded = expandedId === q.id;
          const grade = gradeConfig[q.grade] || gradeConfig.Weak;
          const GradeIcon = grade.icon;

          return (
            <div key={q.id} className="transition-colors hover:bg-muted/30">
              {/* Collapsed Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full flex items-start gap-4 p-5 text-left"
                aria-expanded={isExpanded}
              >
                <div className="shrink-0 size-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="font-medium text-sm leading-relaxed line-clamp-2">{q.questionText}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">{q.category}</Badge>
                    <Badge variant="outline" className={cn("text-[10px]", grade.color)}>
                      <GradeIcon className="size-3 mr-1" /> {q.grade}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" /> {Math.floor(q.timeSpentSeconds / 60)}m {q.timeSpentSeconds % 60}s
                    </span>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-5 pb-6 pl-[68px] space-y-6 animate-in slide-in-from-top-2 duration-200">
                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 border">
                      <p className="text-xs text-muted-foreground mb-1">Technical Score</p>
                      <p className="text-2xl font-bold">{q.technicalScore}<span className="text-sm text-muted-foreground">/100</span></p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border">
                      <p className="text-xs text-muted-foreground mb-1">Communication Score</p>
                      <p className="text-2xl font-bold">{q.communicationScore}<span className="text-sm text-muted-foreground">/100</span></p>
                    </div>
                  </div>

                  {/* Your Answer */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Answer</h4>
                    <div className="p-4 rounded-lg bg-card border text-sm leading-relaxed">{q.userAnswer}</div>
                  </div>

                  {/* Expected Answer (backend never sends these; render only if present) */}
                  {q.expectedAnswer.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expected Answer</h4>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm leading-relaxed">{q.expectedAnswer}</div>
                  </div>
                  )}

                  {/* Follow-up Conversation (Phase 4B voice follow-ups) */}
                  {q.followUp && q.followUp.asked && q.followUp.exchanges.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground">💬 Follow-up Conversation</h5>
                    {q.followUp.exchanges.map((fx, i) => (
                      <div key={i} className="p-4 rounded-lg bg-muted/30 border text-sm leading-relaxed space-y-2">
                        <p><span className="font-semibold">Interviewer: </span>{fx.question}</p>
                        <p><span className="font-semibold">You: </span>{fx.answer}</p>
                      </div>
                    ))}
                  </div>
                  )}

                  {/* Strong / Weak Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 space-y-2">
                      <h5 className="text-xs font-semibold text-green-600 flex items-center gap-1"><CheckCircle2 className="size-3.5" /> Strong Points</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 marker:text-green-500 text-muted-foreground">
                        {q.strongPoints.map(p => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 space-y-2">
                      <h5 className="text-xs font-semibold text-orange-600 flex items-center gap-1"><AlertTriangle className="size-3.5" /> Weak Points</h5>
                      <ul className="text-sm space-y-1 list-disc pl-4 marker:text-orange-500 text-muted-foreground">
                        {q.weakPoints.map(p => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                    <h5 className="text-xs font-semibold text-primary flex items-center gap-1"><Lightbulb className="size-3.5" /> AI Explanation</h5>
                    <p className="text-sm leading-relaxed">{q.aiExplanation}</p>
                  </div>

                  {/* Missing Keywords */}
                  {q.keywordsMissing.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-muted-foreground">Keywords Missing</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {q.keywordsMissing.map(kw => (
                          <Badge key={kw} variant="outline" className="text-xs bg-red-500/5 text-red-600 border-red-500/30">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvement Tips (rendered only when present) */}
                  {q.improvementTips.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-muted-foreground">💡 Improvement Tips</h5>
                    <ul className="text-sm space-y-1.5 text-muted-foreground">
                      {q.improvementTips.map(tip => (
                        <li key={tip} className="flex items-start gap-2">
                          <span className="shrink-0 size-1.5 rounded-full bg-primary mt-2" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
