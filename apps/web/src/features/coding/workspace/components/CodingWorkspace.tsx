"use client";

import { useEffect } from "react";
import { Problem } from "@/services/coding/coding.types";
import { useWorkspaceStore } from "../store/use-workspace-store";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceToolbar } from "./WorkspaceToolbar";
import { ProblemPanel } from "./ProblemPanel";
import { EditorPanel } from "./EditorPanel";
import { ConsolePanel } from "./ConsolePanel";
import { SubmissionDialog } from "../../submission/components/SubmissionDialog";
import { useSubmissionStore } from "../../submission/store/use-submission-store";
import { cn } from "@/lib/utils";

interface CodingWorkspaceProps {
  problem: Problem;
}

export function CodingWorkspace({ problem }: CodingWorkspaceProps) {
  const { 
    isFullscreen,
    panelSizes, setPanelSizes,
    rightPanelSizes, setRightPanelSizes
  } = useWorkspaceStore();

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + S (Save Draft)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        useWorkspaceStore.getState().saveCode();
      }
      // Ctrl + Enter (Run Code)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        useWorkspaceStore.getState().runCode(problem.id);
      }
      
      // Shift + Enter (Submit Solution)
      if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        const state = useSubmissionStore.getState();
        const stage = state.submissionStage;
        if (stage === 'idle' || stage === 'completed' || stage === 'error') {
          state.setSubmitDialogOpen(true);
        }
      }

      // Ctrl + Shift + C (Clear Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        useWorkspaceStore.getState().clearConsole();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      "flex flex-col bg-background overflow-hidden",
      isFullscreen ? "fixed inset-0 z-50" : "h-[calc(100vh-4rem)]" // Assuming 4rem is main site header height
    )}>
      <SubmissionDialog problem={problem} />
      <WorkspaceHeader problem={problem} />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full w-full rounded-none"
          onLayout={(sizes: number[]) => setPanelSizes([sizes[0], sizes[1]])}
        >
          {/* Left Panel: Problem Statement */}
          <ResizablePanel 
            defaultSize={panelSizes[0]} 
            minSize={25}
            maxSize={60}
          >
            <ProblemPanel problem={problem} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel: Editor + Console */}
          <ResizablePanel defaultSize={panelSizes[1]} minSize={30}>
            <div className="h-full flex flex-col bg-card">
              <WorkspaceToolbar problemId={problem.id} />
              
              <ResizablePanelGroup 
                direction="vertical"
                onLayout={(sizes: number[]) => setRightPanelSizes([sizes[0], sizes[1]])}
              >
                {/* Editor */}
                <ResizablePanel defaultSize={rightPanelSizes[0]} minSize={20}>
                  <EditorPanel problemId={problem.id} />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Console */}
                <ResizablePanel defaultSize={rightPanelSizes[1]} minSize={10}>
                  <ConsolePanel problemId={problem.id} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
