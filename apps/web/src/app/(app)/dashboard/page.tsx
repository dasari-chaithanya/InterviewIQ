"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { WelcomeCard } from "@/features/dashboard/components/welcome-card";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { ContinuePractice } from "@/features/dashboard/components/continue-practice";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecentInterviews } from "@/features/dashboard/components/recent-interviews";
import { RecommendationCard } from "@/features/dashboard/components/recommendation-card";
import { GoalTracker } from "@/features/dashboard/components/goal-tracker";
import { AnalyticsPreview } from "@/features/dashboard/components/analytics-preview";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function DashboardPage() {
  return (
    <motion.div 
      className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Row */}
      <motion.div variants={itemVariants}>
        <WelcomeCard />
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants}>
        <StatsGrid />
      </motion.div>

      {/* Main Grid - Two Columns on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Wider) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="h-full">
              <ContinuePractice />
            </motion.div>
            <motion.div variants={itemVariants} className="h-full">
              <QuickActions />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <RecentInterviews />
          </motion.div>
          
          <motion.div variants={itemVariants} className="h-[300px]">
            <AnalyticsPreview />
          </motion.div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <GoalTracker />
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
            <RecommendationCard />
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
