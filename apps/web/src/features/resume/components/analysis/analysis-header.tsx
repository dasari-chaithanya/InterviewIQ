"use client";

import { ResumeAnalysis } from "@/services/resume/resume-analysis.types";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, FileCheck, Target, UserCheck } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  icon: React.ElementType;
  colorClass: string;
}

function ScoreGauge({ score, label, icon: Icon, colorClass }: ScoreGaugeProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="border-border shadow-sm flex-1">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        <div className="relative size-24 mb-3">
          {/* Background Circle */}
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              className="text-muted/30"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              className={`transition-all duration-1000 ease-out ${colorClass}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{score}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Icon className="size-4" />
          {label}
        </div>
      </CardContent>
    </Card>
  );
}

interface AnalysisHeaderProps {
  analysis: ResumeAnalysis;
}

export function AnalysisHeader({ analysis }: AnalysisHeaderProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ScoreGauge 
        score={analysis.overallScore} 
        label="Overall Score" 
        icon={Bot} 
        colorClass="text-blue-500" 
      />
      <ScoreGauge 
        score={analysis.atsCompatibility} 
        label="ATS Match" 
        icon={FileCheck} 
        colorClass="text-green-500" 
      />
      <ScoreGauge 
        score={analysis.interviewReadiness} 
        label="Readiness" 
        icon={Target} 
        colorClass="text-purple-500" 
      />
      <ScoreGauge 
        score={analysis.profileCompleteness} 
        label="Completeness" 
        icon={UserCheck} 
        colorClass="text-orange-500" 
      />
    </div>
  );
}
