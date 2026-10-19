"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useCodingStore } from "../store/coding-store";
import { useRunCode, useSubmitCode } from "../hooks/use-coding";
import { ProblemStatement } from "./problem-statement";
import { CodeEditor } from "./code-editor";
import { ConsolePanel } from "./console-panel";
import { RunControls } from "./run-controls";
import { ExecutionResult } from "../services/coding.types";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export function CodingWorkspace({ problemId }: { problemId: string }) {
  const router = useRouter();
  const { state, dispatch } = useCodingStore();
  const runMutation = useRunCode();
  const submitMutation = useSubmitCode();
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  const handleRun = useCallback(() => {
    if (!state.code.trim()) {
      toast.error("Please write some code first.");
      return;
    }
    dispatch({ type: "OPEN_CONSOLE_WITH_RESULT" });
    runMutation.mutate(
      { problemId, code: state.code, language: state.language },
      {
        onSuccess: (result) => {
          setExecutionResult(result);
        },
        onError: () => {
          toast.error("Execution service failed.");
        }
      }
    );
  }, [state.code, state.language, problemId, dispatch, runMutation]);

  const handleSubmit = useCallback(() => {
    if (!state.code.trim()) {
      toast.error("Please write some code first.");
      return;
    }
    
    // Save code to localstorage temporarily so report page can pick it up
    localStorage.setItem(`pending_submission_${problemId}`, JSON.stringify({
      code: state.code,
      language: state.language
    }));

    router.push(`/coding/${problemId}/report?submission=pending`);
  }, [state.code, state.language, problemId, router]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to Run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
      // Shift + Enter to Submit
      if (e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
      // Ctrl + / to Toggle Console (Standard for many IDEs)
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        dispatch({ type: "TOGGLE_CONSOLE" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, handleRun, handleSubmit]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background overflow-hidden">
      <header className="h-12 border-b bg-card flex items-center px-4 gap-4 shrink-0">
        <Link href="/coding" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm font-medium">
          <ChevronLeft className="size-4" /> Problems
        </Link>
      </header>
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        
        {/* Left Panel: Problem Statement */}
        {state.isProblemPanelOpen && (
          <>
            <ResizablePanel defaultSize={40} minSize={25} maxSize={70} className="bg-card">
              <ProblemStatement problemId={problemId} />
            </ResizablePanel>
            <ResizableHandle className="w-1.5 bg-border/50 hover:bg-primary/50 transition-colors" />
          </>
        )}

        {/* Right Panel: Editor & Console */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={state.isConsoleOpen ? 70 : 100} minSize={20}>
              <CodeEditor problemId={problemId} />
            </ResizablePanel>
            
            <ResizableHandle className="h-1.5 bg-border/50 hover:bg-primary/50 transition-colors" />
            
            {state.isConsoleOpen && (
              <ResizablePanel defaultSize={30} minSize={15} maxSize={80}>
                <ConsolePanel 
                  problemId={problemId} 
                  executionResult={executionResult}
                  isExecuting={runMutation.isPending}
                />
              </ResizablePanel>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>

      </ResizablePanelGroup>

      {/* Bottom Bar: Run Controls */}
      <RunControls 
        onRun={handleRun} 
        onSubmit={handleSubmit}
        isExecuting={runMutation.isPending}
        isSubmitting={submitMutation.isPending}
      />
    </div>
  );
}
