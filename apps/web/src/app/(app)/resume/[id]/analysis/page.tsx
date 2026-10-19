"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { useResumeAnalysis, useAnalyzeResume } from "@/hooks/resume/use-resume-analysis";
import { AnalysisProgress } from "@/features/resume/components/analysis/analysis-progress";
import { AnalysisHeader } from "@/features/resume/components/analysis/analysis-header";
import { SkillsSection } from "@/features/resume/components/analysis/skills-section";
import { ExperienceTimeline } from "@/features/resume/components/analysis/experience-timeline";
import { ProjectAnalysisCard } from "@/features/resume/components/analysis/project-analysis-card";
import { MatchCards } from "@/features/resume/components/analysis/match-cards";
import { InsightsAndSuggestions } from "@/features/resume/components/analysis/insights-and-suggestions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;
  
  const { data: analysis, isLoading: isQueryLoading, refetch } = useResumeAnalysis(resumeId);
  const { mutate: triggerAnalysis, isPending: isAnalyzing } = useAnalyzeResume();

  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);

  // Auto-trigger analysis if it doesn't exist
  useEffect(() => {
    if (!isQueryLoading && analysis === null && !isAnalyzing && !hasStartedAnalysis) {
      setHasStartedAnalysis(true);
      triggerAnalysis(resumeId);
    }
  }, [analysis, isQueryLoading, isAnalyzing, hasStartedAnalysis, triggerAnalysis, resumeId]);

  if (isQueryLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  // Show processing experience if analysis is currently running
  if (isAnalyzing || (analysis === null && hasStartedAnalysis)) {
    return <AnalysisProgress onComplete={() => refetch()} />;
  }

  // Fallback empty state
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h2 className="text-2xl font-bold">Analysis Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn't find an analysis for this resume.
        </p>
        <Button onClick={() => triggerAnalysis(resumeId)}>
          Start Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/resume")}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Career Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Generated {new Date(analysis.lastAnalysisDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => triggerAnalysis(resumeId)} disabled={isAnalyzing}>
          <RefreshCw className="size-4" />
          Reanalyze
        </Button>
      </div>

      <motion.div 
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <AnalysisHeader analysis={analysis} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <motion.div variants={itemVariants}>
              <SkillsSection skills={analysis.skills} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ExperienceTimeline 
                experience={analysis.experience} 
                education={analysis.education} 
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <ProjectAnalysisCard projects={analysis.projects} />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <MatchCards 
                roles={analysis.roleMatches} 
                companies={analysis.companyMatches} 
              />
            </motion.div>
          </div>

          {/* Right Column (Insights & Sidebar) */}
          <div className="flex flex-col gap-8">
            <motion.div variants={itemVariants} className="sticky top-6">
              <InsightsAndSuggestions 
                insights={analysis.insights}
                readiness={analysis.readinessByTopic}
                improvements={analysis.improvements}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
