"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report/report.service";

export function useHistory() {
  return useQuery({
    queryKey: ["interviewHistory"],
    queryFn: () => reportService.getHistory(),
  });
}
