"use client";

import { useReviewStore } from "../store/use-review-store";
import { useSubmissionStore } from "../../submission/store/use-submission-store";
import { ReviewTimeline } from "./ReviewTimeline";
import { OverallScoreCard } from "./OverallScoreCard";
import { ComplexityCard } from "./ComplexityCard";
import { CodeSmellCard, OptimizationCard, EdgeCaseCard, ReviewFeedbackCards } from "./ReviewDetailCards";
import { StrengthsWeaknessesCard, SuggestionCard } from "./SuggestionCards";
import { Brain, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function AIReviewPanel({ problemId, submissionId }: { problemId: string, submissionId: string }) {
  const { reviewStage, latestReviews, generateReview, isPanelExpanded, setPanelExpanded } = useReviewStore();
  
  // Auto-trigger review when a new submission completes and we haven't started reviewing it
  useEffect(() => {
    if (submissionId && reviewStage === 'idle' && !latestReviews[submissionId]) {
      generateReview(problemId, submissionId);
    }
  }, [submissionId, reviewStage, latestReviews, generateReview, problemId]);

  // If we have a new submission id but the store still has a completed review from an old submission, we need to reset
  // The store should probably reset on a new submission. We can handle that via a useEffect.
  useEffect(() => {
    const currentReview = latestReviews[submissionId];
    if (submissionId && !currentReview && reviewStage === 'completed') {
       generateReview(problemId, submissionId);
    }
  }, [submissionId, latestReviews, reviewStage, generateReview, problemId]);

  if (reviewStage === 'idle' && !latestReviews[submissionId]) return null;

  return (
    <div className="border-t border-border mt-4">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setPanelExpanded(!isPanelExpanded)}
      >
        <div className="flex items-center gap-2">
          <Brain className="size-5 text-purple-500" />
          <h3 className="font-semibold text-foreground">AI Code Review</h3>
          {reviewStage !== 'completed' && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 animate-pulse ml-2">Generating...</span>}
          {reviewStage === 'completed' && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 ml-2">Ready</span>}
        </div>
        <Button variant="ghost" size="icon" className="size-8">
          {isPanelExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {isPanelExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-6">
              {reviewStage !== 'completed' && !latestReviews[submissionId] ? (
                <ReviewTimeline />
              ) : latestReviews[submissionId] ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <OverallScoreCard review={latestReviews[submissionId]} />
                  <ComplexityCard review={latestReviews[submissionId]} />
                  <ReviewFeedbackCards review={latestReviews[submissionId]} />
                  <EdgeCaseCard review={latestReviews[submissionId]} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <OptimizationCard review={latestReviews[submissionId]} />
                    <CodeSmellCard review={latestReviews[submissionId]} />
                  </div>
                  <StrengthsWeaknessesCard review={latestReviews[submissionId]} />
                  <SuggestionCard review={latestReviews[submissionId]} />
                  
                  <div className="pt-4 pb-2 border-t flex justify-end">
                    <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Link href={`/coding/report/${submissionId}`}>
                        <FileText className="size-4 mr-2" />
                        View Full Coding Report
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
