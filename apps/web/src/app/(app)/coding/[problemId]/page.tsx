"use client";

import { useParams } from "next/navigation";
import { CodingWorkspace } from "@/features/coding/workspace/coding-workspace";
import { CodingProvider } from "@/features/coding/store/coding-store";
import { useProblem } from "@/features/coding/hooks/use-coding";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemWorkspacePage() {
  const params = useParams();
  const problemId = params.problemId as string;
  const { data: problem, isLoading } = useProblem(problemId);

  if (isLoading) {
    return <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center p-8">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>;
  }

  if (!problem) {
    return <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <p className="text-muted-foreground">Problem not found.</p>
    </div>;
  }

  return (
    <CodingProvider>
      <CodingWorkspace problemId={problemId} />
    </CodingProvider>
  );
}
