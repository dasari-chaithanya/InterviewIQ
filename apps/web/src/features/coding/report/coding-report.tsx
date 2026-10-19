"use client";

import { SubmissionReport } from "../services/coding.types";
import { AIComplexityAnalysis } from "./ai-complexity-analysis";
import { AICodeSmells } from "./ai-code-smells";
import { SubmissionHistory } from "./submission-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export function CodingReport({ report, history }: { report: SubmissionReport, history: SubmissionReport[] }) {
  const isAccepted = report.execution.status === "Accepted";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/coding/${report.problemId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submission Result</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            {isAccepted ? (
              <span className="text-green-500 font-medium">Accepted</span>
            ) : (
              <span className="text-red-500 font-medium">{report.execution.status}</span>
            )}
            • {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                <Sparkles className="size-5" />
                AI Code Review
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{report.aiSummary}</ReactMarkdown>
            </CardContent>
          </Card>

          <AIComplexityAnalysis complexity={report.complexity} />
          
          <AICodeSmells smells={report.codeSmells} />

          {report.optimizedSolution && (
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Trophy className="size-5 text-yellow-500" />
                  Optimized Solution Example
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-6 bg-card text-sm font-mono overflow-x-auto">
                  <code>{report.optimizedSolution}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Execution Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Runtime</span>
                <p className="text-2xl font-bold font-mono">{report.execution.runtime} <span className="text-sm text-muted-foreground">ms</span></p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Memory</span>
                <p className="text-2xl font-bold font-mono">{report.execution.memory} <span className="text-sm text-muted-foreground">MB</span></p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Language</span>
                <p className="font-medium capitalize">{report.language}</p>
              </div>
            </CardContent>
          </Card>

          <SubmissionHistory submissions={history} />
        </div>
      </div>
    </div>
  );
}
