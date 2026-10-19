"use client";

import { useWorkspaceStore } from "../store/use-workspace-store";
import { Activity, Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export function OutputPanel() {
  const { currentResult, executionStatus } = useWorkspaceStore();

  if (executionStatus === 'idle' && !currentResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Activity className="size-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Run your code to see output here.</p>
      </div>
    );
  }

  if (executionStatus === 'preparing' || executionStatus === 'compiling' || executionStatus === 'running') {
    return (
      <div className="p-4 font-mono text-sm space-y-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="text-blue-400">&gt;</span> Preparing environment...
        </motion.div>
        {executionStatus === 'compiling' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-blue-400">&gt;</span> Compiling code...
          </motion.div>
        )}
        {executionStatus === 'running' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-blue-400">&gt;</span> Running test cases...
          </motion.div>
        )}
      </div>
    );
  }

  if (!currentResult) return null;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 font-mono text-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2 font-sans font-semibold">
            <Terminal className="size-3" /> Standard Output
          </div>
          <div className="bg-black/5 p-3 rounded-md border border-border/50 whitespace-pre-wrap">
            {currentResult.stdout || <span className="italic text-muted-foreground/50">No output</span>}
          </div>
        </div>

        {currentResult.stderr && (
          <div className="space-y-2">
            <div className="text-xs text-red-500 uppercase tracking-wider mb-2 font-sans font-semibold">
              Standard Error
            </div>
            <div className="bg-red-500/5 text-red-600 p-3 rounded-md border border-red-500/20 whitespace-pre-wrap">
              {currentResult.stderr}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-sans font-semibold">
            Compiler Message
          </div>
          <div className="bg-muted/30 p-3 rounded-md border border-border/50 whitespace-pre-wrap text-muted-foreground">
            {currentResult.compilerMessage}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
