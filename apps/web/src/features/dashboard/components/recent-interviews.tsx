"use client";

import { useRecentInterviews } from "@/hooks/dashboard/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RecentInterviews() {
  const { data: interviews, isLoading } = useRecentInterviews();

  if (isLoading) {
    return (
      <Card className="border-border shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Interviews</CardTitle>
        <CardDescription>Your latest practice sessions and their scores.</CardDescription>
      </CardHeader>
      <CardContent>
        {interviews && interviews.length > 0 ? (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <Link 
                href={interview.status === "Completed" ? `/report/${interview.id}` : `/interview/${interview.id}`}
                key={interview.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="font-semibold text-sm">{interview.company}</h4>
                  <p className="text-xs text-muted-foreground">{interview.role} • {new Date(interview.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "hidden sm:inline-flex",
                      interview.status === "Completed" && "border-green-500 text-green-600 bg-green-500/10",
                      interview.status === "In Progress" && "border-blue-500 text-blue-600 bg-blue-500/10",
                      interview.status === "Needs Review" && "border-orange-500 text-orange-600 bg-orange-500/10"
                    )}
                  >
                    {interview.status}
                  </Badge>
                  <div className="text-right">
                    <span className="font-bold">{interview.score}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            You haven&apos;t completed any interviews yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
