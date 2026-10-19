  "use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report/report.service";

export function useReport(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: ["report", sessionId],
    queryFn: () => reportService.getReport(sessionId),
    enabled: !!sessionId && enabled,
  });
}

/**
 * Real evaluation lifecycle state (Phase 4D).
 * Polls the persisted status while PENDING/PROCESSING so refresh,
 * navigation-away-and-back, and slow Ollama workers all converge on the
 * true backend state instead of a timed animation.
 */
export function useEvaluationStatus(sessionId: string) {
  const query = useQuery({
    queryKey: ["evaluation-status", sessionId],
    queryFn: () => reportService.getEvaluationStatus(sessionId),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const status = query.state.data;
      return status === "PENDING" || status === "PROCESSING" ? 3000 : false;
    },
  });

  // Auto-trigger exactly once when no evaluation row exists yet.
  useEffect(() => {
    if (query.data === null && !query.isFetching) {
      reportService.ensureEvaluation(sessionId).finally(() => {
        query.refetch();
      });
    }
    // Intentionally runs when the null-state is first observed only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data === null]);

  return query;
}
