"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CodingStats } from "@/services/coding/coding.types";
import { Flame, CheckCircle2, Clock, Terminal, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const useCountUp = (end: number, duration: number = 1.5) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

interface CodingKpiCardsProps {
  stats: CodingStats;
}

export function CodingKpiCards({ stats }: CodingKpiCardsProps) {
  const solvedCount = useCountUp(stats.totalSolved);
  const streakCount = useCountUp(stats.currentStreak);
  const hoursCount = useCountUp(Math.floor(stats.practiceTimeMinutes / 60));
  const acceptanceCount = useCountUp(stats.acceptanceRate);

  const kpis = [
    {
      label: "Problems Solved",
      value: solvedCount,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Current Streak",
      value: streakCount,
      suffix: " Days",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Acceptance Rate",
      value: acceptanceCount,
      suffix: "%",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Practice Hours",
      value: hoursCount,
      suffix: "h",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Favorite Language",
      value: stats.favoriteLanguage,
      isString: true,
      icon: Terminal,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Current Rank",
      value: "Knight", // Mock
      isString: true,
      icon: Trophy,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {kpis.map((kpi, idx) => (
        <motion.div key={idx} variants={item}>
          <Card className="h-full border-border/50 hover:border-primary/20 transition-colors bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                <div className={cn("p-1.5 rounded-md", kpi.bgColor)}>
                  <kpi.icon className={cn("size-4", kpi.color)} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono capitalize">
                  {kpi.isString ? kpi.value : `${kpi.value}${kpi.suffix || ""}`}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
