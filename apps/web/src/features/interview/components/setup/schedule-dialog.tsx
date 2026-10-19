"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock, Loader2 } from "lucide-react";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "Schedule" for READY sessions, "Reschedule" for SCHEDULED ones. */
  mode?: "Schedule" | "Reschedule";
  onConfirm: (input: { scheduledAtLocal: string; timeZone: string }) => Promise<void> | void;
}

/** Local wall-clock "YYYY-MM-DDTHH:mm" for datetime-local inputs. */
export function toLocalInputValue(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

/**
 * Phase 5 schedule dialog. Sends wall-clock + explicit IANA zone; the
 * server owns conversion and validation. No countdowns, no fake states.
 */
export function ScheduleDialog({ open, onOpenChange, mode = "Schedule", onConfirm }: ScheduleDialogProps) {
  const browserZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [value, setValue] = useState(() => toLocalInputValue(new Date(Date.now() + 60 * 60 * 1000)));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setError(null);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
      setError("Pick a valid date and time.");
      return;
    }
    setBusy(true);
    try {
      await onConfirm({ scheduledAtLocal: value, timeZone: browserZone });
      onOpenChange(false);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
        (err instanceof Error ? err.message : `${mode} failed. Please try again.`);
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="size-5 text-muted-foreground" /> {mode} Interview
          </DialogTitle>
          <DialogDescription>
            Choose a future date and time. Times are interpreted in your timezone ({browserZone}); the server decides when the interview can start.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="schedule-at">Date &amp; time ({browserZone})</Label>
          <Input
            id="schedule-at"
            type="datetime-local"
            value={value}
            min={toLocalInputValue(new Date())}
            onChange={(e) => setValue(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={busy}>
            {busy && <Loader2 className="size-4 mr-2 animate-spin" />}
            Confirm {mode === "Schedule" ? "Schedule" : "Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
