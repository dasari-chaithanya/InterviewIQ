"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { taxonomyService } from "@/services/taxonomy/taxonomy.service";
import { interviewService } from "@/services/interview/interview.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

/**
 * Minimal Quick Check entry: pick a canonical role, start a preset
 * 10-MCQ diagnostic session. Effective values (count, types, difficulty,
 * diversity) are owned by the QUICK_CHECK preset server-side.
 */
export function QuickCheckSetup() {
  const router = useRouter();
  const [roleSlug, setRoleSlug] = useState<string>("");
  const [isStarting, setIsStarting] = useState(false);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["question-bank-roles"],
    queryFn: () => taxonomyService.getRoles(),
  });

  const selected = roles.find((r) => r.slug === roleSlug);

  const handleStart = async () => {
    if (!selected) return;
    setIsStarting(true);
    try {
      const session = await interviewService.createSession({
        role: selected.name,
        company: "Quick Check",
        difficulty: "Intermediate",
        type: "Technical",
        durationMinutes: 20,
        questionCount: 10,
        voiceMode: "Text",
        allowFollowUps: false,
        codingChallengeEnabled: false,
        questionSource: "QUESTION_BANK",
        preset: "QUICK_CHECK",
        roleSlug: selected.slug,
        quickCheck: { count: 10, maxPerSkill: 3 },
      });
      router.push(`/interview/${session.id}`);
    } catch {
      toast.error("Failed to start Quick Check. Please try again.");
      setIsStarting(false);
    }
  };

  return (
    <Card className="border-border shadow-sm max-w-xl mx-auto mt-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5 text-amber-500" /> Quick Check
        </CardTitle>
        <CardDescription>
          A 10-question MCQ diagnostic from the curated Question Bank. A fresh attempt is created every time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Target Role</Label>
          <Select value={roleSlug} onValueChange={(v) => setRoleSlug(v ?? "")} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading roles..." : "Select a role"} />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.slug} value={role.slug}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleStart} disabled={!selected || isStarting} className="w-full">
          {isStarting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" /> Starting...
            </>
          ) : (
            "Start Quick Check"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
