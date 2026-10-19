"use client";

import { InterviewSession } from "@/services/interview/interview.types";
import { useDeleteSession } from "@/hooks/interview/use-interview";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { PlayCircle, CheckCircle2, Clock, Trash2, MoreVertical, Building2, Code2, CalendarClock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { formatInZone } from "@/features/interview/components/scheduled-waiting";

interface SessionCardProps {
  session: InterviewSession;
}

export function SessionCard({ session }: SessionCardProps) {
  const router = useRouter();
  const { mutate: deleteSession, isPending } = useDeleteSession();

  const isCompleted = session.status === "Completed";
  const isScheduled = (session.status as string) === "SCHEDULED";
  const scheduledZone = session.scheduledTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const progressPercent = Math.min((session.progress.completedQuestions / session.configuration.questionCount) * 100, 100);

  return (
    <Card className="border-border shadow-sm group hover:border-primary/30 transition-colors">
      <CardContent className="p-5 flex flex-col gap-4">
        
        {/* Header: Role & Actions */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-base line-clamp-1">{session.configuration.role}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
              <Building2 className="size-3.5" />
              {session.configuration.company}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className={
                isCompleted
                  ? "bg-green-500/10 text-green-600 border-green-500/30"
                  : isScheduled
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    : "bg-blue-500/10 text-blue-600 border-blue-500/30"
              }
            >
              {isScheduled ? "Scheduled" : session.status}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isScheduled && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/interview/${session.id}`)}
                  >
                    <CalendarClock className="size-4 mr-2" /> Reschedule
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  onClick={() => deleteSession(session.id)}
                  disabled={isPending}
                >
                  <Trash2 className="size-4 mr-2" /> Delete Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Details: Type, Difficulty, Score/Progress */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Type</span>
            <div className="font-medium flex items-center gap-1.5">
              {session.configuration.codingChallengeEnabled ? <Code2 className="size-3.5" /> : null}
              {session.configuration.type}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Difficulty</span>
            <div className="font-medium">{session.configuration.difficulty}</div>
          </div>
        </div>

        {/* Progress or Score */}
        {isCompleted ? (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Final Score</span>
              <span className="text-green-600 font-bold">{session.finalScore}%</span>
            </div>
            <Progress value={session.finalScore ?? 0} className="h-1.5 [&>div]:bg-green-500" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Progress</span>
              <span>{session.progress.completedQuestions} / {session.configuration.questionCount}</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        )}

        {/* Footer: Date & Action */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {isScheduled && session.scheduledAt
              ? formatInZone(session.scheduledAt, scheduledZone)
              : formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
          </div>
          <Button
            size="sm"
            variant={isCompleted ? "secondary" : "default"}
            onClick={() => router.push(`/interview/${session.id}`)}
            className="gap-2"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="size-4" /> View Report
              </>
            ) : isScheduled ? (
              <>
                <CalendarClock className="size-4" /> View Schedule
              </>
            ) : (
              <>
                <PlayCircle className="size-4" /> Continue
              </>
            )}
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
}
