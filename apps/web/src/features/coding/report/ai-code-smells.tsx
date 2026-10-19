"use client";

import { AICodeSmell } from "../services/coding.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AICodeSmells({ smells }: { smells: AICodeSmell[] }) {
  if (smells.length === 0) {
    return (
      <Card className="border-green-500/20 shadow-sm overflow-hidden bg-green-500/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-600">
            <ShieldCheck className="size-5" />
            Clean Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700/80">AI found no code smells. Great job adhering to best practices!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <FileWarning className="size-5 text-orange-500" />
          AI Code Smells
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {smells.map((smell, i) => (
            <div key={i} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-orange-500" />
                  <span className="font-semibold text-sm">{smell.type}</span>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">Line {smell.line}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{smell.description}</p>
                <div className="text-sm p-3 bg-muted/50 rounded-lg border border-primary/10">
                  <span className="font-semibold text-primary mr-2">Suggestion:</span>
                  <span className="text-muted-foreground">{smell.suggestion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Ensure ShieldCheck is available for the empty state
import { ShieldCheck } from "lucide-react";
