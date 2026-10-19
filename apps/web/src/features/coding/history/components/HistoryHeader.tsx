"use client";

import { CheckCircle2, Target, Zap, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function HistoryHeader() {
  const stats = [
    { label: "Accepted", value: "342", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Rejected", value: "140", icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Avg Score", value: "88", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Fastest Runtime", value: "12ms", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Best Memory", value: "32MB", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6 border-b pb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Attempt History</h1>
        <p className="text-muted-foreground">
          Review your past submissions, compare attempts, and track your progress.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-full ${stat.bg} ${stat.color} shrink-0`}>
                  <stat.icon className="size-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  <div className="text-xl font-bold font-mono tracking-tight">{stat.value}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
