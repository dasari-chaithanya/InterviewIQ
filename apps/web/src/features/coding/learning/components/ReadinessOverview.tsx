"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function CircularGauge({ value, label, size = "md" }: { value: number, label: string, size?: "md" | "lg" }) {
  const radius = size === "lg" ? 45 : 30;
  const stroke = size === "lg" ? 8 : 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const color = value >= 90 ? "text-green-500" : value >= 75 ? "text-blue-500" : value >= 60 ? "text-orange-500" : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-muted/30"
          />
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={color}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold font-mono", size === "lg" ? "text-2xl" : "text-lg", color)}>{value}%</span>
        </div>
      </div>
      <span className={cn("font-semibold text-center uppercase tracking-wider text-muted-foreground", size === "lg" ? "text-sm" : "text-[10px]")}>
        {label}
      </span>
    </div>
  );
}

export function ReadinessOverview() {
  return (
    <Card className="shadow-sm border-blue-500/20 bg-gradient-to-br from-card to-blue-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BrainCircuit className="size-5 text-blue-500" />
          Overall Coding Readiness
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          <CircularGauge value={68} label="Interview Ready" size="lg" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <CircularGauge value={85} label="Technical Confidence" />
            <CircularGauge value={92} label="Consistency Score" />
            <CircularGauge value={64} label="Progress to Goal" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
