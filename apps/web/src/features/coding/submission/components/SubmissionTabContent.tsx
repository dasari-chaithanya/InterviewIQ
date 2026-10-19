"use client";

import { useSubmissionStore } from "../store/use-submission-store";
import { SubmissionPipeline } from "./SubmissionPipeline";
import { SubmissionSummary } from "./SubmissionSummary";
import { HiddenTestPanel } from "./HiddenTestPanel";
import { AIReviewPanel } from "../../review/components/AIReviewPanel";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmissionTabContentProps {
  problemId: string;
}

export function SubmissionTabContent({ problemId }: SubmissionTabContentProps) {
  const { submissionStage, latestSubmissions, setSubmitDialogOpen } = useSubmissionStore();

  if (submissionStage === 'idle' && !latestSubmissions[problemId]) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Upload className="size-10 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
        <p className="text-sm max-w-sm text-center mb-6">
          Submit your solution to have it evaluated against the complete hidden test suite.
        </p>
        <Button onClick={() => setSubmitDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <Upload className="size-4 mr-2" /> Submit Solution
        </Button>
      </div>
    );
  }

  if (submissionStage !== 'idle' && submissionStage !== 'completed') {
    return (
      <div className="h-full overflow-y-auto">
        <SubmissionPipeline />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col divide-y divide-border overflow-y-auto">
      <div className="shrink-0">
        <SubmissionSummary problemId={problemId} />
      </div>
      <div className="shrink-0 min-h-[300px]">
        <HiddenTestPanel problemId={problemId} />
      </div>
      <div className="shrink-0">
        <AIReviewPanel problemId={problemId} submissionId={latestSubmissions[problemId].id} />
      </div>
    </div>
  );
}
