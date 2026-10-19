"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useReport, useEvaluationStatus } from "@/hooks/report/use-report";
import { reportService } from "@/services/report/report.service";
import { EvaluationPipeline } from "@/features/report/components/evaluation-pipeline";
import { ReportHeader } from "@/features/report/components/report-header";
import { QuestionReview } from "@/features/report/components/question-review";
import { SkillRadarChart } from "@/features/report/components/skill-radar-chart";
import { AISummaryCard, StrengthWeaknessCards, InsightCards, RoadmapSection } from "@/features/report/components/report-cards";
import { Skeleton } from "@/components/ui/skeleton";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export default function ReportPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [retrying, setRetrying] = useState(false);
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useEvaluationStatus(sessionId);
  const completed = status === "COMPLETED";
  const failed = status === "FAILED";
  const { data: report, isLoading: reportLoading } = useReport(sessionId, completed);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await reportService.retryEvaluation(sessionId);
    } finally {
      setRetrying(false);
      refetchStatus();
    }
  };

  // No evaluation row yet, or still working: honest waiting state driven by
  // the persisted backend lifecycle (refresh-safe, navigation-safe).
  if (statusLoading || status === undefined || status === null || status === "PENDING" || status === "PROCESSING") {
    return (
      <div className="max-w-3xl mx-auto">
        <EvaluationPipeline phase={status === "PROCESSING" ? "PROCESSING" : status === "PENDING" ? "PENDING" : "STARTING"} />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="max-w-3xl mx-auto">
        <EvaluationPipeline phase="FAILED" onRetry={handleRetry} retrying={retrying} />
      </div>
    );
  }

  if (reportLoading || !report) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto pb-16 space-y-8 p-4"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <ReportHeader report={report} />
      </motion.div>

      <motion.div variants={item}>
        <AISummaryCard summary={report.aiSummary} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          <StrengthWeaknessCards strengths={report.strengths} weaknesses={report.weaknesses} />
          <QuestionReview results={report.questionResults} />
        </motion.div>
        <motion.div variants={item} className="space-y-8">
          <SkillRadarChart data={report.radarData} />
          <InsightCards insights={report.aiInsights} />
          <RoadmapSection roadmap={report.roadmap} />
        </motion.div>
      </div>
    </motion.div>
  );
}
