"use client";

import { useSubmissionStore } from "../store/use-submission-store";
import { CheckCircle2, XCircle, SkipForward, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HiddenTestPanelProps {
  problemId: string;
}

export function HiddenTestPanel({ problemId }: HiddenTestPanelProps) {
  const { latestSubmissions } = useSubmissionStore();
  const submission = latestSubmissions[problemId];

  if (!submission) return null;

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <FlaskConical className="size-5 text-muted-foreground" />
        <h3 className="font-semibold">Hidden Test Results</h3>
        <span className="ml-auto text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {submission.hiddenTestsPassed} / {submission.hiddenTestsTotal} Passed
        </span>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-4 pr-4">
          {submission.hiddenTestDetails.map((tc, idx) => (
            <motion.div
              key={tc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              className={cn(
                "p-3 rounded-lg border text-sm flex flex-col gap-2",
                tc.passed ? "bg-green-500/10 border-green-500/20 text-green-700" :
                tc.skipped ? "bg-muted/50 border-border text-muted-foreground opacity-50" :
                "bg-red-500/10 border-red-500/20 text-red-700"
              )}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>Test {idx + 1}</span>
                {tc.passed ? <CheckCircle2 className="size-4" /> : tc.skipped ? <SkipForward className="size-4" /> : <XCircle className="size-4" />}
              </div>
              
              {!tc.skipped && (
                <div className="text-[10px] uppercase font-mono tracking-wider opacity-80 flex justify-between">
                  <span>{tc.runtime}ms</span>
                  <span>{tc.memory}MB</span>
                </div>
              )}
              {tc.skipped && (
                <div className="text-[10px] uppercase font-mono tracking-wider opacity-80">
                  Skipped
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
