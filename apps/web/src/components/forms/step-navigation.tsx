"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StepNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
}

export function StepNavigation({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  isLoading,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        disabled={isFirstStep || isLoading}
        className={isFirstStep ? "invisible" : ""}
      >
        Back
      </Button>
      <Button
        type="button"
        onClick={onNext}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLastStep ? "Complete" : "Continue"}
      </Button>
    </div>
  );
}
