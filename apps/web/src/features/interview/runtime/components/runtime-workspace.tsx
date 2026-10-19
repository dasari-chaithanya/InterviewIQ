"use client";

import { useEffect, useState, useCallback } from "react";
import { InterviewSession } from "@/services/interview/interview.types";
import { RuntimeProvider, useRuntimeStore } from "../store/runtime-store";
import { runtimeService } from "../services/runtime.service";
import { SessionHeader } from "./session-header";
import { QuestionCard, AIThinking } from "./question-card";
import { AnswerWorkspace } from "./answer-workspace";
import { QuestionMap } from "./question-map";
import { RuntimeFooter } from "./runtime-footer";
import { FinishDialog } from "./finish-dialog";
import { ExitDialog } from "./exit-dialog";
import { ShortcutDialog } from "./shortcut-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

interface RuntimeWorkspaceProps {
  session: InterviewSession;
}

function WorkspaceContent({ session }: RuntimeWorkspaceProps) {
  const { state, dispatch } = useRuntimeStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  // Initialize questions and rehydrate persisted state
  useEffect(() => {
    async function init() {
      try {
        const questions = await runtimeService.generateQuestions(session.id, session.configuration);
        
        // Ensure session is started/active
        await runtimeService.startSession(session.id).catch(() => null);

        // Fetch server-authoritative runtime state (existing answers, index, timer)
        const runtimeState = await runtimeService.getRuntimeState(session.id).catch(() => null);

        const initAnswers: Record<string, any> = {};
        questions.forEach((q: any) => {
          const persisted = runtimeState?.answers?.find((a: any) => a.questionId === q.id);
          initAnswers[q.id] = {
            questionId: q.id,
            text: persisted?.answer || "",
            timeSpentSeconds: persisted?.durationSeconds || 0,
            status: persisted?.answer?.trim() ? "Answered" : "Unanswered",
            lastSavedAt: persisted?.lastSavedAt,
            reflection: persisted?.metadata?.reflection,
          };
        });

        const currentIdx = (runtimeState?.currentQuestionIndex !== undefined && runtimeState.currentQuestionIndex < questions.length)
          ? runtimeState.currentQuestionIndex
          : 0;

        const isPaused = runtimeState?.status === "PAUSED";
        const durationSec = (session.configuration?.durationMinutes || 30) * 60;
        const timeElapsed = runtimeState?.remainingSeconds !== null && runtimeState?.remainingSeconds !== undefined
          ? Math.max(0, durationSec - runtimeState.remainingSeconds)
          : 0;

        dispatch({
          type: "HYDRATE_RUNTIME",
          payload: {
            sessionId: session.id,
            questions,
            currentQuestionIndex: currentIdx,
            answers: initAnswers,
            isPaused,
            timeElapsedSeconds: timeElapsed,
          },
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load interview questions.");
      } finally {
        setIsInitializing(false);
      }
    }
    init();
  }, [session, dispatch]);

  // ─── Navigation Synchronization ────────────────────────
  const handleNext = useCallback(() => {
    if (state.currentQuestionIndex >= state.questions.length - 1) {
      dispatch({ type: "TOGGLE_FINISH_DIALOG" });
      return;
    }
    setIsThinking(true);
    dispatch({ type: "NEXT_QUESTION" });
    runtimeService.navigateQuestion(state.sessionId, "NEXT").catch(console.error);
    setTimeout(() => {
      setIsThinking(false);
    }, 1200);
  }, [state.currentQuestionIndex, state.questions.length, state.sessionId, dispatch]);

  const handlePrev = useCallback(() => {
    if (state.currentQuestionIndex > 0) {
      dispatch({ type: "PREV_QUESTION" });
      runtimeService.navigateQuestion(state.sessionId, "PREV").catch(console.error);
    }
  }, [state.currentQuestionIndex, state.sessionId, dispatch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isTextarea = document.activeElement?.tagName === "TEXTAREA";
      const mod = e.metaKey || e.ctrlKey;

      // If inside textarea, only handle modifier combos
      if (isTextarea && !mod) return;

      if (mod && e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
      if (mod && e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
      if (mod && e.key === "Enter") { e.preventDefault(); handleNext(); }
      if (mod && e.key.toLowerCase() === "m") {
        e.preventDefault();
        const q = state.questions[state.currentQuestionIndex];
        if (q) dispatch({ type: "MARK_QUESTION", payload: q.id });
      }
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); dispatch({ type: "TOGGLE_QUESTION_MAP" }); }
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        toast("Draft saved", { duration: 1500 });
      }
      if (e.key === "Escape" && !mod) {
        e.preventDefault();
        // Close any open dialog first, then open exit dialog
        if (state.isFinishDialogOpen) dispatch({ type: "TOGGLE_FINISH_DIALOG" });
        else if (state.isShortcutDialogOpen) dispatch({ type: "TOGGLE_SHORTCUT_DIALOG" });
        else if (state.isQuestionMapOpen) dispatch({ type: "TOGGLE_QUESTION_MAP" });
        else dispatch({ type: "TOGGLE_EXIT_DIALOG" });
      }
      if (e.key === "?" && !isTextarea && !mod) {
        e.preventDefault();
        dispatch({ type: "TOGGLE_SHORTCUT_DIALOG" });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch, state.currentQuestionIndex, state.questions, state.isFinishDialogOpen, state.isShortcutDialogOpen, state.isQuestionMapOpen, handleNext]);

  // ─── Loading State ──────────────────────────────────────
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Initializing Secure Workspace...</p>
      </div>
    );
  }

  // ─── Main Render ────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <SessionHeader config={session.configuration} />

      <main className="flex-1 flex overflow-hidden">
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-32">
            <AnimatePresence mode="wait">
              {isThinking ? (
                <AIThinking key="thinking" />
              ) : (
                <div className="space-y-8" key={`content-${state.currentQuestionIndex}`}>
                  <QuestionCard />
                  <AnswerWorkspace
                    isVoice={session.configuration.voiceMode === "Voice"}
                    isCoding={session.configuration.codingChallengeEnabled}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-border bg-background/90 backdrop-blur z-10">
            <RuntimeFooter onThinking={setIsThinking} />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden xl:block w-80 border-l border-border bg-muted/10 p-6">
          <QuestionMap />
        </div>
      </main>

      {/* Mobile Question Map Drawer */}
      <Sheet open={state.isQuestionMapOpen} onOpenChange={() => dispatch({ type: "TOGGLE_QUESTION_MAP" })}>
        <SheetContent side="right" className="w-80 p-6">
          <SheetHeader className="mb-4">
            <SheetTitle>Questions</SheetTitle>
          </SheetHeader>
          <QuestionMap />
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      <FinishDialog />
      <ExitDialog />
      <ShortcutDialog />
    </div>
  );
}

export function RuntimeWorkspace({ session }: RuntimeWorkspaceProps) {
  return (
    <RuntimeProvider>
      <WorkspaceContent session={session} />
    </RuntimeProvider>
  );
}
