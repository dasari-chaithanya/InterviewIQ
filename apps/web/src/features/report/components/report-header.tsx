"use client";

import { InterviewReport } from "@/services/report/report.types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, CalendarDays } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  colorClass: string;
}

function ScoreGauge({ score, label, colorClass }: ScoreGaugeProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative size-20 mb-2">
        <svg className="size-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} strokeWidth="6" stroke="currentColor" fill="transparent" className="text-muted/30" />
          <circle cx="40" cy="40" r={radius} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" className={`transition-all duration-1000 ease-out ${colorClass}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export function ReportHeader({ report }: { report: InterviewReport }) {
  const mins = Math.floor(report.durationSeconds / 60);

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Interview Report</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="size-3.5" /> {report.company}</span>
            <span>•</span>
            <span>{report.role}</span>
            <span>•</span>
            <Badge variant="outline">{report.difficulty}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {mins} min</span>
          <span className="flex items-center gap-1"><CalendarDays className="size-3.5" /> {new Date(report.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Score Gauges */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
            <ScoreGauge score={report?.scores?.overall || 0} label="Overall" colorClass="text-blue-500" />
            <ScoreGauge score={report?.scores?.technical || 0} label="Technical" colorClass="text-purple-500" />
            <ScoreGauge score={report?.scores?.communication || 0} label="Communication" colorClass="text-green-500" />
            <ScoreGauge score={report?.scores?.confidence || 0} label="Confidence" colorClass="text-orange-500" />
            <ScoreGauge score={report?.scores?.problemSolving || 0} label="Problem Solving" colorClass="text-cyan-500" />
            <ScoreGauge score={report?.scores?.timeManagement || 0} label="Time Mgmt" colorClass="text-pink-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
