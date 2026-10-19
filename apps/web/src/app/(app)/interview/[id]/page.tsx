"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/interview/use-interview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RuntimeWorkspace } from "@/features/interview/runtime/components/runtime-workspace";
import { ScheduledWaiting } from "@/features/interview/components/scheduled-waiting";

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const { data: session, isLoading, refetch } = useSession(params.id as string);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold">Session Not Found</h2>
        <p className="text-muted-foreground">This interview session does not exist or has been deleted.</p>
        <Button onClick={() => router.push("/interview")}>Return to Dashboard</Button>
      </div>
    );
  }

  // Hide the global navbar/sidebar by rendering this outside of standard layouts, 
  // or relying on the Next.js routing tree. Since this is under (app), it might still have the layout.
  // In a real production app, we might use a parallel route or a separate layout group for full-screen.
  // For now, RuntimeWorkspace is designed to take up the full available screen height.

  // Phase 5: SCHEDULED sessions wait here until due. The workspace is
  // never mounted early, and the backend rejects premature starts anyway.
  if (!started && (session as { status?: string }).status === "SCHEDULED") {
    return (
      <ScheduledWaiting
        session={session}
        onStarted={() => {
          setStarted(true);
          refetch();
        }}
      />
    );
  }

  return <RuntimeWorkspace session={session} />;
}
