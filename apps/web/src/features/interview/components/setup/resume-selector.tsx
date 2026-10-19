"use client";

import { useResumes } from "@/hooks/resume/use-resume";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeSelectorProps {
  value?: string;
  onChange: (id: string | undefined) => void;
}

export function ResumeSelector({ value, onChange }: ResumeSelectorProps) {
  const { data: resumes, isLoading } = useResumes();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Continue without Resume Option */}
        <Card 
          className={cn(
            "border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors",
            value === undefined && "border-primary bg-primary/5 ring-1 ring-primary"
          )}
          onClick={() => onChange(undefined)}
        >
          <CardContent className="p-4 flex items-center gap-4 h-full">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <FileText className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">General Interview</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Continue without a resume.</p>
            </div>
            {value === undefined && <CheckCircle2 className="size-5 text-primary" />}
          </CardContent>
        </Card>

        {resumes?.map(resume => (
          <Card 
            key={resume.id}
            className={cn(
              "border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors",
              value === resume.id && "border-primary bg-primary/5 ring-1 ring-primary",
              resume.status !== "Ready" && "opacity-50 pointer-events-none"
            )}
            onClick={() => resume.status === "Ready" && onChange(resume.id)}
          >
            <CardContent className="p-4 flex items-center gap-4 h-full">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{resume.filename}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {resume.aiAnalyzed ? "AI Analyzed" : "Ready for use"}
                </p>
              </div>
              {value === resume.id && <CheckCircle2 className="size-5 text-primary shrink-0" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
