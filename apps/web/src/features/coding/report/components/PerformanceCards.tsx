"use client";

import { SubmissionResult } from "../../submission/store/use-submission-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Cpu, FlaskConical, Code2 } from "lucide-react";

export function SubmissionSummaryCard({ submission }: { submission: SubmissionResult }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Submission Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="size-4" />
              <span className="text-xs uppercase font-semibold">Runtime</span>
            </div>
            <div className="font-mono text-xl font-bold">{submission.runtime} ms</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Cpu className="size-4" />
              <span className="text-xs uppercase font-semibold">Memory</span>
            </div>
            <div className="font-mono text-xl font-bold">{submission.memory} MB</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FlaskConical className="size-4" />
              <span className="text-xs uppercase font-semibold">Hidden Tests</span>
            </div>
            <div className="font-mono text-xl font-bold text-foreground">
              {submission.hiddenTestsPassed} <span className="text-muted-foreground text-sm">/ {submission.hiddenTestsTotal}</span>
            </div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Code2 className="size-4" />
              <span className="text-xs uppercase font-semibold">Language</span>
            </div>
            <div className="font-mono text-xl font-bold capitalize">{submission.language}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceMetricsCard({ submission }: { submission: SubmissionResult }) {
  // Mock percentiles for the report
  const runtimePercentile = submission.status === 'Accepted' ? 85 : 0;
  const memoryPercentile = submission.status === 'Accepted' ? 78 : 0;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performance vs Peers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Runtime ({submission.runtime} ms)</span>
            <span className="text-muted-foreground">Beats {runtimePercentile}%</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${runtimePercentile}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Memory ({submission.memory} MB)</span>
            <span className="text-muted-foreground">Beats {memoryPercentile}%</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${memoryPercentile}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
