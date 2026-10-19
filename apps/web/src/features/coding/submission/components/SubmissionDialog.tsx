"use client";

import { useSubmissionStore } from "../store/use-submission-store";
import { useWorkspaceStore } from "../../workspace/store/use-workspace-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Problem } from "@/services/coding/coding.types";

interface SubmissionDialogProps {
  problem: Problem;
}

export function SubmissionDialog({ problem }: SubmissionDialogProps) {
  const { isSubmitDialogOpen, setSubmitDialogOpen, startSubmission } = useSubmissionStore();
  const { language, setActiveConsoleTab } = useWorkspaceStore();

  const handleSubmit = () => {
    setActiveConsoleTab("submission");
    startSubmission(problem.id, language);
  };

  return (
    <Dialog open={isSubmitDialogOpen} onOpenChange={setSubmitDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Solution</DialogTitle>
          <DialogDescription>
            You are about to submit your {language} solution for {problem.title}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg flex gap-3 mt-4 border border-border/50">
          <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Evaluation Details</p>
            <p className="text-muted-foreground">
              Your solution will be evaluated against hidden test cases to verify its correctness and efficiency. This process may take a few seconds.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 sm:justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setSubmitDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
            Submit Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
