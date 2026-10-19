"use client";

import { CodingAnalyticsHeader } from "@/features/coding/analytics/components/CodingAnalyticsHeader";
import { CodingKpiCards } from "@/features/coding/analytics/components/CodingKpiCards";
import { ActivityHeatmap } from "@/features/coding/analytics/components/ActivityHeatmap";
import { 
  DifficultyDistributionChart, 
  TopicMasteryRadar, 
  LanguageUsageChart,
  AcceptanceTrendChart,
  CompanyReadinessChart
} from "@/features/coding/analytics/components/CodingCharts";
import { AchievementsSection, MilestonesTimeline } from "@/features/coding/analytics/components/AchievementsSection";
import { motion } from "framer-motion";

export default function CodingAnalyticsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20">
      <CodingAnalyticsHeader />
      
      <CodingKpiCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <ActivityHeatmap />
          </motion.div>
        </div>
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
            <AcceptanceTrendChart />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <DifficultyDistributionChart />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <TopicMasteryRadar />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <LanguageUsageChart />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <CompanyReadinessChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <AchievementsSection />
          </motion.div>
        </div>
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="h-full">
            <MilestonesTimeline />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
