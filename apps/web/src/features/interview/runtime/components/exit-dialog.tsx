"use client";

import { useRuntimeStore } from "../store/runtime-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { interviewService } from "@/services/interview/interview.service";

export function ExitDialog() {
  const { state, dispatch } = useRuntimeStore();
  const router = useRouter();

  const close = () => dispatch({ type: "TOGGLE_EXIT_DIALOG" });
  const [discarding, setDiscarding] = useState(false);

  const handleResumeLater = () => {
    toast.success("Session saved. You can continue later from the dashboard.");
    close();
    router.push("/interview");
  };

  const handleDiscard = async () => {
    // Phase 6: the button says Discard, so it actually deletes the session
    // instead of merely navigating away with a misleading toast.
    if (!state.sessionId || discarding) return;
    setDiscarding(true);
    try {
      await interviewService.deleteSession(state.sessionId);
      toast.success("Session discarded.");
      close();
      router.push("/interview");
    } catch {
      toast.error("Could not discard the session. Please try again.");
    } finally {
      setDiscarding(false);
    }
  };

  return (
    <Dialog open={state.isExitDialogOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="size-5 text-muted-foreground" />
            Leave Interview?
          </DialogTitle>
          <DialogDescription>
            Your progress has been automatically saved. You can return and continue this interview anytime from the dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-sm">
            <Save className="size-4 text-green-600 shrink-0" />
            <span>All {state.answeredCount} answered questions and drafts are saved.</span>
          </div>
          {state.markedCount > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm">
              <AlertTriangle className="size-4 text-blue-600 shrink-0" />
              <span>{state.markedCount} question{state.markedCount > 1 ? "s" : ""} marked for review.</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={close} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleResumeLater} className="w-full sm:w-auto gap-2">
            <Save className="size-4" /> Resume Later
          </Button>
          <Button variant="destructive" onClick={handleDiscard} disabled={discarding} className="w-full sm:w-auto gap-2">
            <Trash2 className="size-4" /> {discarding ? "Discarding…" : "Discard"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
