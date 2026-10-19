"use client";

import { use, useEffect, useState } from "react";
import { useProblems } from "@/services/coding/use-coding";
import { ProblemHeader } from "@/features/coding/problem-details/components/ProblemHeader";
import { ProblemMetadata } from "@/features/coding/problem-details/components/ProblemMetadata";
import { ProblemDescription } from "@/features/coding/problem-details/components/ProblemDescription";
import { ExampleSection } from "@/features/coding/problem-details/components/ExampleSection";
import { ConstraintSection } from "@/features/coding/problem-details/components/ConstraintSection";
import { HintSection } from "@/features/coding/problem-details/components/HintSection";
import { RelatedProblems } from "@/features/coding/problem-details/components/RelatedProblems";
import { ProblemActions } from "@/features/coding/problem-details/components/ProblemActions";
import { DiscussionPlaceholder, EditorialPlaceholder } from "@/features/coding/problem-details/components/Placeholders";
import { ProblemDetailsSkeleton, ProblemDetailsEmptyState, ProblemDetailsErrorState } from "@/features/coding/problem-details/components/ProblemDetailsSkeleton";
import { Building2, Tags } from "lucide-react";
import { motion } from "framer-motion";

export default function ProblemDetailsPage({ params }: { params: Promise<{ problemId: string }> }) {
  const resolvedParams = use(params);
  const problemId = resolvedParams.problemId;
  
  const { data: problems, isLoading, error, refetch } = useProblems();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
        <ProblemDetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
        <ProblemDetailsErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const problem = problems?.find(p => p.id === problemId);

  if (!problem) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
        <ProblemDetailsEmptyState />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full pb-24">
      <ProblemHeader problem={problem} />
      <ProblemMetadata problem={problem} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-8">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <ProblemDescription problem={problem} />
          <ExampleSection />
          <ConstraintSection />
          <HintSection />
          <ProblemActions />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
              <Tags className="size-4 text-muted-foreground" />
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {problem.topics.map(topic => (
                <span 
                  key={topic}
                  className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
              <Building2 className="size-4 text-muted-foreground" />
              Companies
            </h3>
            <div className="flex flex-wrap gap-2">
              {problem.companies.map(company => (
                <span 
                  key={company.name}
                  className="px-2.5 py-1 bg-muted text-muted-foreground border rounded-md text-xs font-medium"
                >
                  {company.name}
                </span>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EditorialPlaceholder />
            <DiscussionPlaceholder />
          </motion.div>
        </div>
      </div>

      <RelatedProblems currentProblemId={problemId} problems={problems || []} />
    </div>
  );
}
