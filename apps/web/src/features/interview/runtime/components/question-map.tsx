"use client";

import { useRuntimeStore } from "../store/runtime-store";
import { runtimeService } from "../services/runtime.service";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, AlertCircle, Bookmark } from "lucide-react";

export function QuestionMap() {
  const { state, dispatch } = useRuntimeStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Answered": return <CheckCircle2 className="size-4 text-green-500" />;
      case "Skipped": return <AlertCircle className="size-4 text-orange-500" />;
      case "Marked": return <Bookmark className="size-4 text-blue-500" />;
      default: return <Circle className="size-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Session Overview</h3>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {state.questions.map((q, index) => {
          const isActive = index === state.currentQuestionIndex;
          const status = state.answers[q.id]?.status || "Unanswered";

          return (
            <button
              key={q.id}
              onClick={() => {
                dispatch({ type: "JUMP_TO_QUESTION", payload: index });
                runtimeService.navigateQuestion(state.sessionId, "JUMP", index).catch(console.error);
              }}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors border",
                isActive 
                  ? "bg-primary/5 border-primary/30 ring-1 ring-primary/30 shadow-sm" 
                  : "bg-background border-transparent hover:bg-muted/50"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {getStatusIcon(status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold">Question {index + 1}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{q.category}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {q.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
