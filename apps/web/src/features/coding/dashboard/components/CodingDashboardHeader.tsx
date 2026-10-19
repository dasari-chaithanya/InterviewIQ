"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code2, ArrowRight, Play, BarChart3 } from "lucide-react";
import Link from "next/link";
import { CodingStats } from "@/services/coding/coding.types";

interface CodingDashboardHeaderProps {
  stats: CodingStats;
}

export function CodingDashboardHeader({ stats }: CodingDashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-border">
      <div className="space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <Code2 className="size-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Coding Interview Platform</h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm flex items-center gap-3"
        >
          <span>🔥 {stats.currentStreak} Day Streak</span>
          <span>•</span>
          <span>✅ {stats.totalSolved} Problems Solved</span>
        </motion.p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3"
      >
        <Button variant="outline" asChild className="hidden sm:flex">
          <Link href="/coding/analytics">
            <BarChart3 className="mr-2 size-4" />
            Analytics
          </Link>
        </Button>
        <Button asChild>
          <Link href="/coding/problems">
            Browse Problems
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
