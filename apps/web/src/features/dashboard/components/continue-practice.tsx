"use client";

import { useContinuePractice } from "@/hooks/dashboard/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlayCircle, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export function ContinuePractice() {
  const { data: interview, isLoading } = useContinuePractice();

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-xl" />;
  }

  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Continue Practice</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {interview ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">{interview.role} Interview</h3>
              <p className="text-sm text-muted-foreground">{interview.company} • {new Date(interview.date).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{interview.score}%</span>
              </div>
              <Progress value={interview.score} className="h-2" />
            </div>

            <Button className="w-full gap-2" asChild>
              <Link href={`/interview/${interview.id}`}>
                <PlayCircle className="size-4" /> Resume Interview
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center">
              <PlayCircle className="size-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">No active sessions</h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mt-1">
                You don&apos;t have any interviews in progress. Start a new one!
              </p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/interview">
                <Plus className="size-4" /> Start New Interview
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
