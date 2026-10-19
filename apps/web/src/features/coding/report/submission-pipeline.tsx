"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, PlayCircle, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const PIPELINE_STAGES = [
  { id: "executing", label: "Running Test Cases", icon: PlayCircle },
  { id: "hidden", label: "Evaluating Hidden Tests", icon: ShieldCheck },
  { id: "complexity", label: "Analyzing Time & Space Complexity", icon: Cpu },
  { id: "review", label: "Generating AI Code Review", icon: Loader2 },
];

export function SubmissionPipeline({ onComplete }: { onComplete: () => void }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    // Simulate pipeline progress
    let currentStage = 0;
    
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage >= PIPELINE_STAGES.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      } else {
        setActiveStage(currentStage);
      }
    }, 1500); // 1.5 seconds per stage for dramatic effect

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto space-y-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="size-24 rounded-full border-2 border-primary border-t-transparent opacity-50"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="size-24 rounded-full border-2 border-primary border-b-transparent absolute inset-0 opacity-50 scale-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {(() => {
            const Icon = PIPELINE_STAGES[activeStage]?.icon || CheckCircle2;
            return <Icon className={cn("size-8 text-primary", activeStage < PIPELINE_STAGES.length ? "animate-pulse" : "")} />;
          })()}
        </div>
      </div>

      <div className="w-full space-y-4">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-4">
            <div className={cn(
              "size-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
              i < activeStage ? "bg-green-500 text-white" : i === activeStage ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"
            )}>
              {i < activeStage ? <CheckCircle2 className="size-4" /> : <span className="text-xs">{i + 1}</span>}
            </div>
            <div className={cn(
              "text-sm font-medium transition-colors",
              i < activeStage ? "text-green-500" : i === activeStage ? "text-foreground" : "text-muted-foreground"
            )}>
              {stage.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
