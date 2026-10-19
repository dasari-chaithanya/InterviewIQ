"use client";

import { useCodingStore } from "../store/coding-store";
import { Button } from "@/components/ui/button";
import { Play, Send, Loader2 } from "lucide-react";

interface RunControlsProps {
  onRun: () => void;
  onSubmit: () => void;
  isExecuting: boolean;
  isSubmitting: boolean;
}

export function RunControls({ onRun, onSubmit, isExecuting, isSubmitting }: RunControlsProps) {
  const { dispatch } = useCodingStore();

  return (
    <div className="h-14 flex items-center justify-between px-4 border-t bg-card">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground hidden sm:flex"
          onClick={() => dispatch({ type: "TOGGLE_CONSOLE" })}
        >
          Console
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          className="w-24 bg-muted hover:bg-muted/80 text-foreground"
          onClick={onRun}
          disabled={isExecuting || isSubmitting}
        >
          {isExecuting ? <Loader2 className="size-4 animate-spin" /> : <><Play className="size-4 mr-1.5" /> Run</>}
        </Button>
        <Button
          className="w-28 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          onClick={onSubmit}
          disabled={isExecuting || isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <><Send className="size-4 mr-1.5" /> Submit</>}
        </Button>
      </div>
    </div>
  );
}
