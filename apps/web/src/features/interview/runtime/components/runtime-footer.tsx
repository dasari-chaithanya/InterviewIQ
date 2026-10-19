"use client";

import { useRuntimeStore } from "../store/runtime-store";
import { runtimeService } from "../services/runtime.service";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bookmark, CheckCircle2, Flag, Keyboard } from "lucide-react";
import { toast } from "sonner";

interface RuntimeFooterProps {
  onThinking: (isThinking: boolean) => void;
}

export function RuntimeFooter({ onThinking }: RuntimeFooterProps) {
  const { state, dispatch } = useRuntimeStore();

  const isFirst = state.currentQuestionIndex === 0;
  const isLast = state.currentQuestionIndex === state.questions.length - 1;
  const currentQ = state.questions[state.currentQuestionIndex];
  const isMarked = currentQ ? state.answers[currentQ.id]?.status === "Marked" : false;

  const handleNext = () => {
    if (isLast) {
      dispatch({ type: "TOGGLE_FINISH_DIALOG" });
      return;
    }
    onThinking(true);
    dispatch({ type: "NEXT_QUESTION" });
    runtimeService.navigateQuestion(state.sessionId, "NEXT").catch(console.error);
    setTimeout(() => {
      onThinking(false);
    }, 1200);
  };

  const handlePrev = () => {
    if (!isFirst) {
      dispatch({ type: "PREV_QUESTION" });
      runtimeService.navigateQuestion(state.sessionId, "PREV").catch(console.error);
    }
  };

  const toggleMark = () => {
    if (!currentQ) return;
    dispatch({ type: "MARK_QUESTION", payload: currentQ.id });
    toast(isMarked ? "Mark removed" : "Marked for review", { duration: 1500 });
  };

  const handleSkip = () => {
    if (!currentQ) return;
    dispatch({ type: "SKIP_QUESTION", payload: currentQ.id });
    toast("Question skipped", { duration: 1500 });
    handleNext();
  };

  return (
    <div className="flex items-center justify-between">
      {/* Left: Secondary Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMark}
          className={isMarked ? "text-blue-500 hover:text-blue-600 bg-blue-500/10" : "text-muted-foreground"}
          aria-label={isMarked ? "Remove review mark" : "Mark for review"}
        >
          <Bookmark className="size-4 mr-1.5" />
          <span className="hidden sm:inline">{isMarked ? "Marked" : "Mark"}</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex" onClick={handleSkip}>
          <Flag className="size-4 mr-1.5" /> Skip
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => dispatch({ type: "TOGGLE_SHORTCUT_DIALOG" })}
          aria-label="Keyboard shortcuts"
        >
          <Keyboard className="size-4" />
        </Button>
      </div>

      {/* Center: Question Counter (mobile) */}
      <div className="flex sm:hidden text-xs font-medium text-muted-foreground">
        {state.currentQuestionIndex + 1} / {state.questions.length}
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={isFirst} className="gap-1.5">
          <ChevronLeft className="size-4" /> <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button
          size="sm"
          onClick={handleNext}
          className={isLast ? "bg-green-600 hover:bg-green-700 text-white gap-1.5" : "gap-1.5"}
        >
          {isLast ? (
            <><CheckCircle2 className="size-4" /> <span className="hidden sm:inline">Finish</span></>
          ) : (
            <><span className="hidden sm:inline">Next</span> <ChevronRight className="size-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
