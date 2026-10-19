"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Target, Zap, Flame, Upload, Code } from "lucide-react";
import { motion } from "framer-motion";

export function CodingKpiCards() {
  const kpis = [
    { title: "Problems Solved", value: "142", trend: "+12 this week", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Acceptance Rate", value: "68.4%", trend: "+2.1% overall", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Avg Runtime", value: "45ms", trend: "Top 20%", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { title: "Current Streak", value: "8 Days", trend: "Longest: 21 Days", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Submissions", value: "482", trend: "32 in last 7 days", icon: Upload, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Languages Used", value: "4", trend: "Mainly TypeScript", icon: Code, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="shadow-sm h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`p-1.5 rounded-full ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono tracking-tight">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
