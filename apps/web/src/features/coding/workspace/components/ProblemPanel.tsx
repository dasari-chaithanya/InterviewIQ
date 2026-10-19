"use client";

import { Problem } from "@/services/coding/coding.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProblemHeader } from "@/features/coding/problem-details/components/ProblemHeader";
import { ProblemMetadata } from "@/features/coding/problem-details/components/ProblemMetadata";
import { ProblemDescription } from "@/features/coding/problem-details/components/ProblemDescription";
import { ExampleSection } from "@/features/coding/problem-details/components/ExampleSection";
import { ConstraintSection } from "@/features/coding/problem-details/components/ConstraintSection";
import { HintSection } from "@/features/coding/problem-details/components/HintSection";

interface ProblemPanelProps {
  problem: Problem;
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  return (
    <div className="h-full bg-card flex flex-col relative">
      <ScrollArea className="flex-1 h-full">
        <div className="p-6">
          <ProblemHeader problem={problem} />
          <ProblemMetadata problem={problem} />
          <ProblemDescription problem={problem} />
          <ExampleSection />
          <ConstraintSection />
          <HintSection />
        </div>
      </ScrollArea>
    </div>
  );
}
