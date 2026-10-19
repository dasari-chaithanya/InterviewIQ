"use client";

import { use, useEffect } from "react";
import { useProblems } from "@/services/coding/use-coding";
import { CodingWorkspace } from "@/features/coding/workspace/components/CodingWorkspace";
import { WorkspaceSkeleton, WorkspaceEmptyState, WorkspaceErrorState } from "@/features/coding/workspace/components/WorkspaceSkeleton";

export default function WorkspacePage({ params }: { params: Promise<{ problemId: string }> }) {
  const resolvedParams = use(params);
  const problemId = resolvedParams.problemId;
  
  const { data: problems, isLoading, error, refetch } = useProblems();

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (error) {
    return <WorkspaceErrorState onRetry={() => refetch()} />;
  }

  const problem = problems?.find(p => p.id === problemId);

  if (!problem) {
    return <WorkspaceEmptyState />;
  }

  return <CodingWorkspace problem={problem} />;
}
