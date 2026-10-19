"use client";

import { use } from "react";
import { useSubmissionStore } from "@/features/coding/submission/store/use-submission-store";
import { useReviewStore } from "@/features/coding/review/store/use-review-store";
import { CodingReportHeader } from "@/features/coding/report/components/CodingReportHeader";
import { CodingScoreOverview } from "@/features/coding/report/components/CodingScoreOverview";
import { SubmissionSummaryCard, PerformanceMetricsCard } from "@/features/coding/report/components/PerformanceCards";
import { AIReviewSummary, OptimizationRoadmap } from "@/features/coding/report/components/AIReviewSummary";
import { ImprovementChecklist, SubmissionTimelineCard, RelatedProblemsCard } from "@/features/coding/report/components/ReportSidebarCards";
import { StrengthsWeaknessesCard } from "@/features/coding/review/components/SuggestionCards";
import { CodeSmellCard } from "@/features/coding/review/components/ReviewDetailCards";
import { ComplexityCard } from "@/features/coding/review/components/ComplexityCard";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CodingReportPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = use(params);
  
  // Since we don't have a backend to fetch specific historical reports by ID in this mock environment,
  // we will try to find it in latestSubmissions. If not, we will just use the first available mock submission for demonstration.
  const { latestSubmissions } = useSubmissionStore();
  const { latestReviews } = useReviewStore();

  const submission = Object.values(latestSubmissions).find(sub => sub.id === submissionId) || Object.values(latestSubmissions)[0];
  const review = Object.values(latestReviews).find(rev => rev.submissionId === submissionId) || (submission ? latestReviews[submission.problemId] : null) || Object.values(latestReviews)[0];

  if (!submission || !review) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <AlertCircle className="size-10 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground mb-6 text-sm">The requested coding report could not be found or has expired.</p>
        <Link href="/coding" className={buttonVariants()}>Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20">
      <CodingReportHeader submission={submission} review={review} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <CodingScoreOverview review={review} />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <AIReviewSummary review={review} />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SubmissionSummaryCard submission={submission} />
            <PerformanceMetricsCard submission={submission} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <ComplexityCard review={review} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <StrengthsWeaknessesCard review={review} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <CodeSmellCard review={review} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <OptimizationRoadmap review={review} />
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <ImprovementChecklist review={review} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <SubmissionTimelineCard submission={submission} review={review} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <RelatedProblemsCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
