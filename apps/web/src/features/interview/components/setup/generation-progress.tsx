"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, FileSearch, Target, BrainCircuit, Rocket } from "lucide-react";

interface GenerationProgressProps {
  onComplete?: () => void;
}

const stages = [
  { id: 1, label: "Analyzing Configuration", icon: FileSearch, duration: 800 },
  { id: 2, label: "Evaluating Resume Alignment", icon: Target, duration: 1000 },
  { id: 3, label: "Generating Dynamic Questions", icon: BrainCircuit, duration: 1200 },
  { id: 4, label: "Preparing AI Coach", icon: Rocket, duration: 1000 },
];

export function GenerationProgress({ onComplete }: GenerationProgressProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runStage = (index: number) => {
      if (index >= stages.length) {
        onComplete?.();
        return;
      }

      timeout = setTimeout(() => {
        setCurrentStageIndex(index + 1);
        runStage(index + 1);
      }, stages[index].duration);
    };

    runStage(0);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-12 min-h-[400px]">
      
      {/* Pulsing Central Icon */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
        />
        <div className="relative size-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center shadow-lg">
          <BrainCircuit className="size-10 text-primary animate-pulse" />
        </div>
      </div>

      {/* Stage List */}
      <div className="w-full max-w-sm space-y-4">
        {stages.map((stage, index) => {
          const isComplete = index < currentStageIndex;
          const isActive = index === currentStageIndex;
          const isPending = index > currentStageIndex;
          const Icon = stage.icon;

          return (
            <motion.div 
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 transition-colors"
            >
              <div className="shrink-0 size-8 flex items-center justify-center">
                {isComplete ? (
                  <CheckCircle2 className="size-6 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="size-6 text-primary animate-spin" />
                ) : (
                  <Icon className="size-5 text-muted-foreground" />
                )}
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground animate-pulse text-center max-w-xs">
        Crafting a personalized interview experience tailored to your background.
      </p>

    </div>
  );
}
