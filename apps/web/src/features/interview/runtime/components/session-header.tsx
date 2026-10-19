"use client";

import { useRuntimeStore } from "../store/runtime-store";
import { runtimeService } from "../services/runtime.service";
import { InterviewConfiguration } from "@/services/interview/interview.types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Cloud, CloudOff, Loader2, Play, Pause, List } from "lucide-react";

export function SessionHeader({ config }: { config: InterviewConfiguration }) {
  const { state, dispatch } = useRuntimeStore();

  const totalQuestions = state.questions.length;
  const progressPercent = totalQuestions > 0 ? (state.answeredCount / totalQuestions) * 100 : 0;

  const togglePause = async () => {
    try {
      if (state.isPaused) {
        dispatch({ type: "RESUME_TIMER" });
        await runtimeService.resumeSession(state.sessionId);
      } else {
        dispatch({ type: "PAUSE_TIMER" });
        await runtimeService.pauseSession(state.sessionId);
      }
    } catch (err) {
      console.error("Failed to toggle pause:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border w-full">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">

        {/* Left: Exit & Branding */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "TOGGLE_EXIT_DIALOG" })}
            className="shrink-0"
            aria-label="Exit interview"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="hidden sm:block">
            <h1 className="font-semibold text-sm leading-tight truncate max-w-[180px]">{config.role}</h1>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{config.company} • {config.type}</p>
          </div>
        </div>

        {/* Center: Progress Bar (desktop) */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1 max-w-md px-8">
          <div className="flex w-full justify-between text-xs font-medium mb-1.5 text-muted-foreground">
            <span>Progress</span>
            <span>{state.answeredCount} of {totalQuestions}</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 w-full" />
        </div>

        {/* Right: Status, Timer, Question Map Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Connection */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            {state.connectionStatus === "Connected" && <Cloud className="size-3.5 text-green-500" />}
            {state.connectionStatus === "Saving" && <Loader2 className="size-3.5 text-blue-500 animate-spin" />}
            {(state.connectionStatus === "Offline" || state.connectionStatus === "Reconnecting") && <CloudOff className="size-3.5 text-red-500" />}
            {state.lastAutoSaveAt && (
              <span className="hidden lg:inline">Saved</span>
            )}
          </div>

          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* Timer */}
          <div className="flex items-center gap-2 bg-muted/50 px-2.5 py-1.5 rounded-md font-mono text-sm tabular-nums">
            <span className={state.isPaused ? "opacity-50" : ""}>
              {Math.floor(state.timeElapsedSeconds / 60).toString().padStart(2, "0")}:
              {(state.timeElapsedSeconds % 60).toString().padStart(2, "0")}
            </span>
            <Button variant="ghost" size="icon" className="size-5 hover:bg-transparent" onClick={togglePause} aria-label={state.isPaused ? "Resume timer" : "Pause timer"}>
              {state.isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
            </Button>
          </div>

          {/* Mobile Question Map Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden shrink-0"
            onClick={() => dispatch({ type: "TOGGLE_QUESTION_MAP" })}
            aria-label="Open question map"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
