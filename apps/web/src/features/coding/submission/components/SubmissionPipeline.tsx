"use client";

import { useSubmissionStore, PipelineStage } from "../store/use-submission-store";
import { Upload, Settings2, Code2, FlaskConical, Gauge, Cpu, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PIPELINE_STEPS = [
  { id: 'uploading', label: 'Uploading Source', icon: Upload },
  { id: 'preparing', label: 'Preparing Environment', icon: Settings2 },
  { id: 'compiling', label: 'Compiling', icon: Code2 },
  { id: 'testing', label: 'Running Hidden Tests', icon: FlaskConical },
  { id: 'evaluating', label: 'Evaluating Metrics', icon: Gauge },
  { id: 'completed', label: 'Finalizing Submission', icon: CheckCircle2 },
];

export function SubmissionPipeline() {
  const { submissionStage } = useSubmissionStore();
  
  const currentStepIndex = PIPELINE_STEPS.findIndex(s => s.id === submissionStage);
  const isCompleted = submissionStage === 'completed';

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 max-w-md mx-auto w-full">
      <div className="w-full space-y-6">
        <h3 className="text-xl font-semibold text-center mb-8">
          {isCompleted ? "Evaluation Complete" : "Evaluating Solution"}
        </h3>
        
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {PIPELINE_STEPS.map((step, idx) => {
            const isActive = submissionStage === step.id;
            const isPast = isCompleted || (currentStepIndex > -1 && idx < currentStepIndex);
            
            return (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background shrink-0 z-10",
                  isActive ? "border-primary text-primary" : 
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
                  isActive ? "bg-card border-primary/50 shadow-md" : 
                  isPast ? "bg-card border-green-500/20" : 
                  "bg-muted/30 border-transparent opacity-50"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{step.label}</span>
                    {isPast && <CheckCircle2 className="size-4 text-green-500" />}
                    {isActive && <span className="text-xs text-primary animate-pulse">Running...</span>}
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
