"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiStepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function MultiStepProgress({ currentStep, totalSteps }: MultiStepProgressProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-xl mx-auto mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    : isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : step}
              </div>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "h-1 w-12 sm:w-20 lg:w-32 transition-colors duration-300 mx-2 rounded-full",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
