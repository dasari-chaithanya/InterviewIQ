"use client";

import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  useRecentSessions, 
  useRecommendations, 
  useInterviewStatistics 
} from "@/hooks/interview/use-interview";
import { SessionCard } from "@/features/interview/components/session-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Target, Trophy, Clock, BrainCircuit, Sparkles } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function InterviewDashboardPage() {
  const router = useRouter();
  const { data: sessions, isLoading: loadingSessions } = useRecentSessions();
  const { data: recommendations, isLoading: loadingRecs } = useRecommendations();
  const { data: stats, isLoading: loadingStats } = useInterviewStatistics();

  return (
    <motion.div 
      className="max-w-7xl mx-auto flex flex-col gap-8 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Interview Hub</h1>
          <p className="text-muted-foreground">
            Configure, manage, and review your AI interview sessions.
          </p>
        </div>
        <Button size="lg" className="gap-2 shrink-0" onClick={() => router.push("/interview/setup")}>
          <Plus className="size-5" /> Start New Interview
        </Button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sessions", value: stats?.totalInterviews, icon: Target, color: "text-blue-500" },
          { label: "Avg Score", value: stats ? `${stats.averageScore}%` : null, icon: Trophy, color: "text-green-500" },
          { label: "Practice Time", value: stats ? `${Math.round(stats.totalTimeSpentMinutes / 60)}h ${stats.totalTimeSpentMinutes % 60}m` : null, icon: Clock, color: "text-purple-500" },
          { label: "Strongest Topic", value: stats?.strongestTopic, icon: BrainCircuit, color: "text-orange-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                {loadingStats ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <p className="text-2xl font-bold truncate max-w-[120px]">{stat.value}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Recent Sessions) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Sessions</h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            {loadingSessions ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center bg-muted/30">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Target className="size-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">No sessions yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
                  Start your first mock interview to get tailored feedback and improve your skills.
                </p>
                <Button onClick={() => router.push("/interview/setup")}>
                  Start New Interview
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar (Recommendations) */}
        <div className="flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold tracking-tight mb-6">Recommended for You</h2>
            <div className="flex flex-col gap-4">
              {loadingRecs ? (
                <>
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </>
              ) : recommendations?.map(rec => (
                <Card key={rec.id} className="border-border shadow-sm bg-primary/5 border-primary/20 hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" /> {rec.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rec.description}
                    </p>
                    <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => router.push("/interview/setup")}>
                      {rec.actionText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

    </motion.div>
  );
}
