"use client";

import { InterviewReport } from "@/services/report/report.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Lightbulb, ArrowUpCircle, Map } from "lucide-react";

export function AISummaryCard({ summary }: { summary: string }) {
  return (
    <Card className="bg-primary/5 border-primary/20 shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-3 text-primary">
          <Lightbulb className="size-5" /> AI Summary
        </h3>
        <p className="text-sm leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}

export function StrengthWeaknessCards({ strengths, weaknesses }: { strengths: string[]; weaknesses: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-green-500/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-green-600">
            <CheckCircle2 className="size-5" /> Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {strengths.map(s => (
              <li key={s} className="flex items-center gap-2 text-sm">
                <span className="shrink-0 size-1.5 rounded-full bg-green-500" /> {s}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="border-orange-500/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-orange-600">
            <AlertTriangle className="size-5" /> Areas to Improve
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {weaknesses.map(w => (
              <li key={w} className="flex items-center gap-2 text-sm">
                <span className="shrink-0 size-1.5 rounded-full bg-orange-500" /> {w}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export function InsightCards({ insights }: { insights: string[] }) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ArrowUpCircle className="size-5 text-primary" /> AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border text-sm">
            <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <ArrowUpCircle className="size-3.5 text-primary" />
            </div>
            <span className="leading-relaxed">{insight}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RoadmapSection({ roadmap }: { roadmap: InterviewReport["roadmap"] }) {
  const timeframes = ["Today", "This Week", "This Month", "Future"] as const;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Map className="size-5 text-primary" /> Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {timeframes.map(tf => {
          const items = roadmap.filter(r => r.timeframe === tf);
          if (items.length === 0) return null;
          return (
            <div key={tf} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{tf}</h4>
              {items.map(item => (
                <div key={item.id} className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h5 className="font-medium text-sm">{item.title}</h5>
                    <div className="flex gap-1.5 shrink-0">
                      <Badge variant="outline" className="text-[10px]">{item.difficulty}</Badge>
                      <Badge variant={item.priority === "High" ? "destructive" : "secondary"} className="text-[10px]">{item.priority}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  <p className="text-xs text-muted-foreground">Est. {item.estimatedHours}h</p>
                </div>
              ))}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
