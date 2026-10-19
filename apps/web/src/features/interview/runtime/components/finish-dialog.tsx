"use client";

import { useState } from "react";
import { useRuntimeStore } from "../store/runtime-store";
import { runtimeService } from "../services/runtime.service";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, AlertTriangle, Clock, Bookmark, SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function FinishDialog() {
  const { state, dispatch } = useRuntimeStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => dispatch({ type: "TOGGLE_FINISH_DIALOG" });

  const total = state.questions.length;
  const completionPercent = total > 0 ? Math.round((state.answeredCount / total) * 100) : 0;
  const elapsedMin = Math.floor(state.timeElapsedSeconds / 60);
  const elapsedSec = state.timeElapsedSeconds % 60;

  const handleFinish = async () => {
    setIsSubmitting(true);
    dispatch({ type: "PAUSE_TIMER" });
    try {
      await runtimeService.submitInterview(state.sessionId);
      dispatch({ type: "SET_FINISHED" });
      toast.success("Interview submitted! Generating report...");
      router.push(`/report/${state.sessionId}`);
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={state.isFinishDialogOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-600" />
            Finish Interview
          </DialogTitle>
          <DialogDescription>
            Review your session summary before submitting for AI evaluation.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          {/* Completion Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Completion</span>
              <span className={completionPercent === 100 ? "text-green-600" : "text-orange-600"}>{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatRow icon={CheckCircle2} label="Answered" value={state.answeredCount} total={total} color="text-green-600" />
            <StatRow icon={SkipForward} label="Skipped" value={state.skippedCount} color="text-orange-600" />
            <StatRow icon={Bookmark} label="Marked" value={state.markedCount} color="text-blue-600" />
            <StatRow icon={Clock} label="Time Spent" value={`${elapsedMin}m ${elapsedSec}s`} color="text-purple-600" />
          </div>

          {/* Warnings */}
          {state.skippedCount > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 text-sm">
              <AlertTriangle className="size-4 text-orange-600 shrink-0 mt-0.5" />
              <span>
                You skipped {state.skippedCount} question{state.skippedCount > 1 ? "s" : ""}. Unanswered questions will receive a lower score.
              </span>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Estimated AI evaluation time: ~30 seconds
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={close} disabled={isSubmitting} className="w-full sm:w-auto">
            Continue Interview
          </Button>
          <Button
            onClick={handleFinish}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            {isSubmitting ? (
              <><Loader2 className="size-4 animate-spin" /> Submitting...</>
            ) : (
              <><CheckCircle2 className="size-4" /> Finish & Generate Report</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatRow({ icon: Icon, label, value, total, color }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  total?: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
      <Icon className={`size-4 ${color} shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">
          {value}{total !== undefined ? ` / ${total}` : ""}
        </p>
      </div>
    </div>
  );
}
