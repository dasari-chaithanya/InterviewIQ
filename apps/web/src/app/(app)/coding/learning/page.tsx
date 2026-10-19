"use client";

import { LearningHeader } from "@/features/coding/learning/components/LearningHeader";
import { ReadinessOverview } from "@/features/coding/learning/components/ReadinessOverview";
import { LearningRoadmap } from "@/features/coding/learning/components/LearningRoadmap";
import { WeakTopicsCard, RecommendedProblemsCard } from "@/features/coding/learning/components/LearningCards";
import { CompanyReadinessCard, WeeklyGoalsCard } from "@/features/coding/learning/components/ProgressCards";
import { LearningInsightsCard, AchievementsCard } from "@/features/coding/learning/components/InsightsCards";
import { StudyCalendar, PracticePlanner, LearningProgress } from "@/features/coding/learning/components/LearningPlanners";
import { motion } from "framer-motion";

export default function AIWeeklyLearningHubPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <LearningHeader />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <ReadinessOverview />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
              <WeakTopicsCard />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="h-full">
              <RecommendedProblemsCard />
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <LearningInsightsCard />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="h-full">
              <CompanyReadinessCard />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="h-full">
              <AchievementsCard />
            </motion.div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <LearningRoadmap />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <WeeklyGoalsCard />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <StudyCalendar />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <PracticePlanner />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <LearningProgress />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
