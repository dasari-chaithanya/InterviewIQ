"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileSearch, Code2, LineChart, Target, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stages = [
  { id: 1, label: "Extracting Content", icon: FileSearch, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, label: "Identifying Skills", icon: Code2, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 3, label: "Analyzing Experience", icon: LineChart, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: 4, label: "Calculating Readiness", icon: Target, color: "text-green-500", bg: "bg-green-500/10" },
  { id: 5, label: "Finalizing Report", icon: Sparkles, color: "text-yellow-500", bg: "bg-yellow-500/10" },
];

interface AnalysisProgressProps {
  onComplete?: () => void;
}

export function AnalysisProgress({ onComplete }: AnalysisProgressProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animate progress and stages
  useEffect(() => {
    // Total duration for the mock analysis is about 4 seconds
    const totalDuration = 4000;
    const intervalTime = 50;
    const increments = totalDuration / intervalTime;
    const progressPerIncrement = 100 / increments;
    const stageDuration = totalDuration / stages.length;

    let currentProgress = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      currentProgress += progressPerIncrement;
      if (currentProgress >= 100) {
        setProgress(100);
        setCurrentStageIndex(stages.length - 1);
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 500); // Small pause at 100% before firing complete
      } else {
        setProgress(currentProgress);
        const elapsed = Date.now() - startTime;
        const newStageIndex = Math.min(
          Math.floor(elapsed / stageDuration),
          stages.length - 1
        );
        setCurrentStageIndex(newStageIndex);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto w-full p-8 text-center space-y-8">
      <div className="relative size-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStageIndex}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.2, opacity: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute inset-0 flex items-center justify-center rounded-full ${stages[currentStageIndex].bg}`}
          >
            {React.createElement(stages[currentStageIndex].icon, {
              className: `size-14 ${stages[currentStageIndex].color}`,
            })}
          </motion.div>
        </AnimatePresence>
        
        {/* Pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full border-4 ${stages[currentStageIndex].color} border-opacity-30`}
        />
      </div>

      <div className="space-y-2 w-full">
        <h3 className="text-2xl font-bold tracking-tight">AI Analysis in Progress</h3>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-muted-foreground font-medium"
          >
            {stages[currentStageIndex].label}...
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-full space-y-2">
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
          <span>0%</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="w-full text-left space-y-3 pt-6 border-t">
        {stages.map((stage, index) => {
          const isComplete = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          return (
            <div 
              key={stage.id}
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                isComplete ? "opacity-100" : isCurrent ? "opacity-100" : "opacity-40"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="size-5 text-green-500" />
              ) : isCurrent ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="size-5 text-primary" />
                </motion.div>
              ) : (
                <div className="size-5 rounded-full border-2 border-muted-foreground/30" />
              )}
              <span className={`text-sm ${isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Add the missing import inside the component logic for the spinner
import { RefreshCw } from "lucide-react";
