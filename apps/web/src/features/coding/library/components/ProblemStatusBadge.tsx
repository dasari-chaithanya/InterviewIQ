"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProblemStatusBadgeProps {
  status: "Solved" | "Attempted" | "Todo";
}

export function ProblemStatusBadge({ status }: ProblemStatusBadgeProps) {
  if (status === "Solved") {
    return <span title="Solved"><CheckCircle2 className="size-4 text-green-500" /></span>;
  }
  if (status === "Attempted") {
    return <span title="Attempted"><Clock className="size-4 text-orange-500" /></span>;
  }
  return <span title="Todo"><Circle className="size-4 text-muted-foreground/30" /></span>;
}
