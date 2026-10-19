"use client";

import { useReviewStore } from "../store/use-review-store";
import { Brain, Cpu, FileText, Settings2, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TIMELINE_STEPS = [
  { id: 'analyzing', label: 'Analyzing Solution', icon: Brain },
  { id: 'complexity', label: 'Checking Complexity', icon: Cpu },
  { id: 'naming', label: 'Inspecting Naming', icon: FileText },
  { id: 'readability', label: 'Reviewing Readability', icon: FileText },
  { id: 'edge_cases', label: 'Checking Edge Cases', icon: ShieldAlert },
  { id: 'optimizations', label: 'Finding Optimizations', icon: Sparkles },
  { id: 'summary', label: 'Preparing Summary', icon: Settings2 },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export function ReviewTimeline() {
  const { reviewStage } = useReviewStore();
  
  const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.id === reviewStage);
  const isCompleted = reviewStage === 'completed';

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 max-w-md mx-auto w-full">
      <div className="w-full space-y-6">
        <h3 className="text-xl font-semibold text-center mb-8 flex items-center justify-center gap-2">
          <Brain className="size-6 text-purple-500 animate-pulse" />
          Generating AI Review...
        </h3>
        
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {TIMELINE_STEPS.map((step, idx) => {
            const isActive = reviewStage === step.id;
            const isPast = isCompleted || (currentStepIndex > -1 && idx < currentStepIndex);
            
            return (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background shrink-0 z-10",
                  isActive ? "border-purple-500 text-purple-500" : 
                  isPast ? "border-green-500 text-green-500 bg-green-500/10" : 
                  "border-muted text-muted-foreground"
                )}>
                  {isActive ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <step.icon className="size-4" />
                    </motion.div>
                  ) : (
                    <step.icon className="size-4" />
                  )}
                </div>
                
                <div className={cn(
                  "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm transition-all",
                  isActive ? "bg-card border-purple-500/50 shadow-md" : 
                  isPast ? "bg-card border-green-500/20" : 
                  "bg-muted/30 border-transparent opacity-50"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{step.label}</span>
                    {isPast && <CheckCircle2 className="size-4 text-green-500" />}
                    {isActive && <span className="text-xs text-purple-500 animate-pulse">Analyzing...</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
