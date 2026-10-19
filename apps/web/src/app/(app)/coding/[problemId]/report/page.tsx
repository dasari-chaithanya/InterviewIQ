"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSubmitCode } from "@/features/coding/hooks/use-coding";
import { SubmissionPipeline } from "@/features/coding/report/submission-pipeline";
import { CodingReport } from "@/features/coding/report/coding-report";
import { SubmissionReport, Language } from "@/features/coding/services/coding.types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";


export default function ProblemReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const problemId = params.problemId as string;
  const isPending = searchParams.get("submission") === "pending";
  
  const [showPipeline, setShowPipeline] = useState(isPending);
  const [report, setReport] = useState<SubmissionReport | null>(null);
  
  const submitMutation = useSubmitCode();

  useEffect(() => {
    // If we land here with pending state, simulate the submission process
    if (isPending && !report && !submitMutation.isPending) {
      const stored = localStorage.getItem(`pending_submission_${problemId}`);
      if (stored) {
        const { code, language } = JSON.parse(stored) as { code: string; language: Language };
        submitMutation.mutate(
          { problemId, code, language },
          {
            onSuccess: (data: unknown) => {
              const res = data as { submission: { id: string; problemId: string; timestamp: number; language: Language; code: string; }; execution: SubmissionReport["execution"]; aiReview?: { complexity?: SubmissionReport["complexity"]; codeSmells?: SubmissionReport["codeSmells"]; summary?: string; expectedSolution?: string; } };
              const mappedReport: SubmissionReport = {
                id: res.submission.id,
                problemId: res.submission.problemId,
                timestamp: res.submission.timestamp.toString(), // Fix timestamp typing
                language: res.submission.language,
                code: res.submission.code,
                execution: res.execution,
                complexity: res.aiReview?.complexity || {
                  expectedTime: "", detectedTime: "", expectedSpace: "", detectedSpace: "", timeExplanation: "", spaceExplanation: ""
                },
                codeSmells: res.aiReview?.codeSmells || [],
                aiSummary: res.aiReview?.summary || "",
                optimizedSolution: res.aiReview?.expectedSolution,
              };
              setReport(mappedReport);
              localStorage.removeItem(`pending_submission_${problemId}`);
              // Note: the pipeline UI runs on its own timer, we just wait for it to call onComplete
            },
            onError: () => {
              toast.error("Failed to generate AI evaluation");
              router.push(`/coding/${problemId}`);
            }
          }
        );
      } else {
        // No stored code, invalid state, go back
        router.push(`/coding/${problemId}`);
      }
    }
  }, [isPending, problemId, report, submitMutation, router]);

  const handlePipelineComplete = () => {
    setShowPipeline(false);
    router.replace(`/coding/${problemId}/report`); // clear query param
  };

  if (showPipeline) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background">
        <SubmissionPipeline onComplete={handlePipelineComplete} />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-96 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Mock history for UI purposes
  const mockHistory = [report];
  if (report.execution.status === "Accepted") {
    mockHistory.push({
      ...report,
      id: "sub-old-1",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      execution: { ...report.execution, status: "Wrong Answer", passedCount: 2, totalCount: 5 }
    });
  }

  return (
    <div className="p-4 md:p-8">
      <CodingReport report={report} history={mockHistory} />
    </div>
  );
}
