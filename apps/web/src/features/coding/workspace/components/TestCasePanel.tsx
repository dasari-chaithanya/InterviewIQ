"use client";

import { useWorkspaceStore } from "../store/use-workspace-store";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionMetrics } from "./ExecutionMetrics";

export function TestCasePanel() {
  const { currentResult, executionStatus } = useWorkspaceStore();

  if (executionStatus === 'idle' && !currentResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <ListChecksPlaceholder />
      </div>
    );
  }

  if (executionStatus === 'preparing' || executionStatus === 'compiling' || executionStatus === 'running') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 space-y-4">
        <div className="relative size-12 flex items-center justify-center">
          <motion.div 
            className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-sm font-medium capitalize animate-pulse text-primary">{executionStatus}...</p>
      </div>
    );
  }

  if (!currentResult) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className={cn(
          "text-xl font-bold",
          currentResult.status === 'Accepted' ? "text-green-500" : "text-red-500"
        )}>
          {currentResult.status}
        </h3>
        <span className="text-sm text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
          <Clock className="size-3" /> {currentResult.runtime}ms
        </span>
      </div>

      <ExecutionMetrics />

      <div className="space-y-4">
        <AnimatePresence>
          {currentResult.testCases.map((tc, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={tc.id}
              className="rounded-lg border bg-card overflow-hidden"
            >
              <div className={cn(
                "px-4 py-2 border-b flex items-center justify-between text-sm font-medium",
                tc.passed ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"
              )}>
                <div className="flex items-center gap-2">
                  {tc.passed ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
                  Case {idx + 1}
                </div>
                <span className="text-xs opacity-80">{tc.executionTime}ms</span>
              </div>
              <div className="p-4 space-y-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Input</div>
                  <div className="font-mono bg-muted/50 p-2 rounded-md break-all">{tc.input}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Actual Output</div>
                  <div className={cn(
                    "font-mono p-2 rounded-md break-all",
                    tc.passed ? "bg-muted/50" : "bg-red-500/10 text-red-600"
                  )}>{tc.actualOutput}</div>
                </div>
                {!tc.passed && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Expected Output</div>
                    <div className="font-mono bg-green-500/10 text-green-600 p-2 rounded-md break-all">{tc.expectedOutput}</div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ListChecksPlaceholder() {
  return (
    <div className="text-center">
      <div className="text-sm space-y-4 max-w-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Case 1</span>
        </div>
        <div className="space-y-2 text-left">
          <div className="font-mono bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">nums =</div>
            [2,7,11,15]
          </div>
          <div className="font-mono bg-muted/50 p-2 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">target =</div>
            9
          </div>
        </div>
        <p className="text-xs mt-4 italic text-muted-foreground/70 text-center">
          Run your code to see execution results here.
        </p>
      </div>
    </div>
  );
}
