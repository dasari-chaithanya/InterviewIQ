"use client";

import { useWorkspaceStore } from "../store/use-workspace-store";
import { Clock, Cpu, CheckCircle2, XCircle, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ExecutionMetrics() {
  const { currentResult } = useWorkspaceStore();

  if (!currentResult) return null;

  const totalTests = currentResult.testCases.length;
  const passedTests = currentResult.testCases.filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const metrics = [
    {
      label: "Runtime",
      value: `${currentResult.runtime} ms`,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      label: "Memory",
      value: `${currentResult.memory} MB`,
      icon: Cpu,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      label: "Passed",
      value: passedTests.toString(),
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      label: "Failed",
      value: failedTests.toString(),
      icon: XCircle,
      color: failedTests > 0 ? "text-red-500" : "text-muted-foreground",
      bgColor: failedTests > 0 ? "bg-red-500/10" : "bg-muted",
      borderColor: failedTests > 0 ? "border-red-500/20" : "border-border"
    },
    {
      label: "Success",
      value: `${successRate}%`,
      icon: Percent,
      color: successRate === 100 ? "text-green-500" : successRate > 0 ? "text-orange-500" : "text-red-500",
      bgColor: successRate === 100 ? "bg-green-500/10" : successRate > 0 ? "bg-orange-500/10" : "bg-red-500/10",
      borderColor: successRate === 100 ? "border-green-500/20" : successRate > 0 ? "border-orange-500/20" : "border-red-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {metrics.map((m, idx) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className={cn("border bg-card shadow-sm", m.borderColor)}>
            <CardContent className="p-3 flex flex-col gap-1 items-center justify-center text-center">
              <div className={cn("p-1.5 rounded-full mb-1", m.bgColor, m.color)}>
                <m.icon className="size-4" />
              </div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                {m.label}
              </div>
              <div className={cn("text-lg font-bold font-mono tracking-tight", m.color)}>
                {m.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
