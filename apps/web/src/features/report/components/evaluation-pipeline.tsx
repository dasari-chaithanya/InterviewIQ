"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EvaluationPhase = "PENDING" | "PROCESSING" | "FAILED" | "STARTING";

interface EvaluationPipelineProps {
  /** Real backend lifecycle phase — never a timed animation. */
  phase: EvaluationPhase;
  onRetry?: () => void;
  retrying?: boolean;
}

const PHASE_COPY: Record<EvaluationPhase, { title: string; body: string }> = {
  STARTING: {
    title: "Requesting Evaluation",
    body: "Queueing your interview for AI evaluation.",
  },
  PENDING: {
    title: "Evaluation Queued",
    body: "Your interview is waiting for the local AI evaluator. This page updates automatically.",
  },
  PROCESSING: {
    title: "AI Evaluation in Progress",
    body: "Our local AI is analyzing your interview responses across multiple dimensions. This usually takes under a minute.",
  },
  FAILED: {
    title: "Evaluation Could Not Complete",
    body: "The evaluator did not return a usable result. No partial scores were saved. You can retry safely.",
  },
};

/**
 * Honest evaluation progress UI (Phase 4D): reflects the persisted
 * backend lifecycle only. No fake percentages, no staged theater, no
 * "completed" state before the backend says COMPLETED.
 */
export function EvaluationPipeline({ phase, onRetry, retrying }: EvaluationPipelineProps) {
  const copy = PHASE_COPY[phase];
  const failed = phase === "FAILED";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-10">
      {/* Pulsing Core */}
      <div className="relative">
        <motion.div
          animate={failed ? {} : { scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-16px] bg-primary/20 rounded-full blur-2xl"
        />
        <div className="relative size-28 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center shadow-xl">
          {failed ? (
            <XCircle className="size-12 text-destructive" />
          ) : (
            <BrainCircuit className="size-12 text-primary" />
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{copy.title}</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">{copy.body}</p>
      </div>

      {failed ? (
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5 text-muted-foreground" />
          {onRetry && (
            <Button onClick={onRetry} disabled={retrying}>
              {retrying && <Loader2 className="size-4 mr-2 animate-spin" />}
              Retry Evaluation
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Waiting for the evaluator — safe to leave and come back.</span>
        </div>
      )}
    </div>
  );
}
