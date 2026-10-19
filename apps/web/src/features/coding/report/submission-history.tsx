"use client";

import { SubmissionReport } from "../services/coding.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubmissionHistory({ submissions }: { submissions: SubmissionReport[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted": return <CheckCircle2 className="size-4 text-green-500" />;
      case "Wrong Answer": return <XCircle className="size-4 text-red-500" />;
      default: return <AlertCircle className="size-4 text-orange-500" />;
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <History className="size-5 text-primary" />
          Submission History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No past submissions found.</p>
        ) : (
          <div className="relative border-l border-muted-foreground/20 ml-3 space-y-6">
            {submissions.map((sub, i) => (
              <div key={sub.id} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 bg-background rounded-full">
                  {getStatusIcon(sub.execution.status)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-semibold text-sm",
                      sub.execution.status === "Accepted" ? "text-green-600" : "text-muted-foreground"
                    )}>
                      Attempt {submissions.length - i}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(sub.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {sub.execution.status} • {sub.execution.runtime}ms • {sub.execution.memory}MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
