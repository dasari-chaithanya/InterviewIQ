"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Loader2, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { InterviewSession } from "@/services/interview/interview.types";
import { interviewService } from "@/services/interview/interview.service";
import { runtimeService } from "@/features/interview/runtime/services/runtime.service";
import { ScheduleDialog } from "@/features/interview/components/setup/schedule-dialog";

/** Render an instant in an explicit IANA zone, e.g. "30 Sep 2026, 15:00 IST". */
export function formatInZone(instantIso: string, timeZone: string): string {
  try {
    const date = new Date(instantIso);
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${get("day")} ${get("month")} ${get("year")}, ${get("hour")}:${get("minute")} (${timeZone})`;
  } catch {
    return new Date(instantIso).toLocaleString();
  }
}

interface ScheduledWaitingProps {
  session: InterviewSession & { scheduledAt?: string | null; scheduledTimezone?: string | null };
  onStarted: () => void;
}

/**
 * Phase 5 waiting room for SCHEDULED sessions. The Start button is a
 * convenience only: the backend remains the authority and rejects early
 * starts with INTERVIEW_NOT_DUE regardless of the browser clock.
 */
export function ScheduledWaiting({ session, onStarted }: ScheduledWaitingProps) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  // Re-evaluate due-ness on a tick: the button must enable when the window
  // opens without requiring a manual refresh. Server still decides on click.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);
  const zone = session.scheduledTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dueMs = session.scheduledAt ? new Date(session.scheduledAt).getTime() : NaN;
  const due = !Number.isNaN(dueMs) && now >= dueMs;

  const handleStart = async () => {
    setStarting(true);
    try {
      await runtimeService.startSession(session.id);
      toast.success("Interview started.");
      onStarted();
    } catch (err) {
      const data = (err as { response?: { data?: { code?: string; message?: string } } }).response?.data;
      if (data?.code === "INTERVIEW_NOT_DUE") {
        toast.error("Not due yet — the interview can start at its scheduled time.");
      } else {
        toast.error(data?.message || "Could not start the interview.");
      }
    } finally {
      setStarting(false);
    }
  };

  const handleReschedule = async (input: { scheduledAtLocal: string; timeZone: string }) => {
    await interviewService.rescheduleSession(session.id, input);
    toast.success("Interview rescheduled.");
    router.refresh();
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="size-5 text-muted-foreground" /> Scheduled Interview
          </CardTitle>
          <CardDescription>
            {session.scheduledAt
              ? `Starts ${formatInZone(session.scheduledAt, zone)}`
              : "Start time will be confirmed shortly."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {due
              ? "Your interview window is open — start whenever you are ready."
              : "Come back at the scheduled time. Starting early is blocked by the server."}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleStart} disabled={!due || starting} className="gap-2">
              {starting ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
              {due ? "Start Now" : "Not Due Yet"}
            </Button>
            <Button variant="outline" onClick={() => setRescheduleOpen(true)}>
              Reschedule
            </Button>
          </div>
        </CardContent>
      </Card>
      <ScheduleDialog open={rescheduleOpen} onOpenChange={setRescheduleOpen} mode="Reschedule" onConfirm={handleReschedule} />
    </div>
  );
}
