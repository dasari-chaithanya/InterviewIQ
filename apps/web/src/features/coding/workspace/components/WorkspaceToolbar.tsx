"use client";

import { useWorkspaceStore, SupportedLanguage } from "../store/use-workspace-store";
import { useSubmissionStore } from "../../submission/store/use-submission-store";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Play, 
  Upload, 
  RotateCcw, 
  Download, 
  Maximize, 
  Copy,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WorkspaceToolbarProps {
  problemId: string;
}

export function WorkspaceToolbar({ problemId }: WorkspaceToolbarProps) {
  const { 
    language, setLanguage, 

    isDirty, lastSavedAt,
    saveCode,
    runCode,
    executionStatus
  } = useWorkspaceStore();

  const { submissionStage, setSubmitDialogOpen } = useSubmissionStore();

  const [savingState, setSavingState] = useState<"idle" | "saving" | "saved">("idle");

  // Mock auto-save
  useEffect(() => {
    if (isDirty) {
      setTimeout(() => setSavingState("saving"), 0);
      const timer = setTimeout(() => {
        saveCode();
        setSavingState("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDirty, saveCode]);

  useEffect(() => {
    if (savingState === "saved") {
      const timer = setTimeout(() => setSavingState("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [savingState]);

  const isRunning = executionStatus === 'preparing' || executionStatus === 'compiling' || executionStatus === 'running';
  const isSubmitting = submissionStage !== 'idle' && submissionStage !== 'completed' && submissionStage !== 'error';
  const isBusy = isRunning || isSubmitting;

  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Select value={language} onValueChange={(v) => setLanguage(v as SupportedLanguage)}>
          <SelectTrigger className="w-[140px] h-9 border-none bg-muted/50 hover:bg-muted font-medium">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="kotlin">Kotlin</SelectItem>
          </SelectContent>
        </Select>

        <div className="hidden md:flex items-center gap-1 ml-2 text-xs text-muted-foreground">
          {savingState === "saving" && <span className="text-yellow-500 flex items-center gap-1"><span className="animate-pulse">●</span> Saving...</span>}
          {savingState === "saved" && <span className="text-green-500">✓ Saved</span>}
          {savingState === "idle" && lastSavedAt && <span>Last saved {new Date(lastSavedAt).toLocaleTimeString()}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 mr-2 border-r pr-2 border-border/50">
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={() => toast.info("Copied to clipboard")}>
            <Copy className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={() => toast.info("Code reset to default")}>
            <RotateCcw className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={() => toast.info("Downloading code...")}>
            <Download className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
            <Settings className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
            <Maximize className="size-4" />
          </Button>
        </div>

        <Button 
          variant="secondary" 
          size="sm" 
          className={cn("shadow-sm min-w-[100px]", isBusy && "bg-muted text-muted-foreground")}
          disabled={isBusy}
          onClick={() => runCode(problemId)}
        >
          {isRunning ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Play className="mr-2 size-4 fill-current" />
          )}
          {isRunning ? "Running" : "Run Code"}
        </Button>
        <Button 
          size="sm" 
          disabled={isBusy} 
          onClick={() => setSubmitDialogOpen(true)}
          className={cn("shadow-sm min-w-[100px]", isSubmitting ? "bg-green-600/50" : "bg-green-600 hover:bg-green-700 text-white")}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Upload className="mr-2 size-4" />
          )}
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </div>
    </div>
  );
}
