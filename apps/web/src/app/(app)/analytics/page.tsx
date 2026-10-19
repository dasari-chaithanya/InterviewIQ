"use client";

import { motion } from "framer-motion";
import { useAnalyticsKPIs, useScoreTrend, useTopicStats, useAchievements, useHeatmap, useCompanyReadiness, useRoleReadiness, useAICoachData } from "@/hooks/report/use-analytics";
import { AICoachDashboard } from "@/features/report/components/ai-coach-dashboard";
import { ReadinessCards } from "@/features/report/components/readiness-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Trophy, Clock, BrainCircuit, Flame, Zap, HelpCircle, TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function AnalyticsPage() {
  const { data: kpis, isLoading: loadingKPIs } = useAnalyticsKPIs();
  const { data: trend, isLoading: loadingTrend } = useScoreTrend();
  const { data: topics, isLoading: loadingTopics } = useTopicStats();
  const { data: achievements, isLoading: loadingAchievements } = useAchievements();
  const { data: heatmap } = useHeatmap();
  const { data: companyReadiness, isLoading: loadingCompany } = useCompanyReadiness();
  const { data: roleReadiness, isLoading: loadingRole } = useRoleReadiness();
  const { data: aiCoach, isLoading: loadingAICoach } = useAICoachData();


  return (
    <motion.div
      className="max-w-7xl mx-auto pb-16 space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your interview performance over time.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Interviews", value: kpis?.totalInterviews, icon: Target, color: "text-blue-500" },
          { label: "Average Score", value: kpis ? `${kpis.averageScore}%` : null, icon: Trophy, color: "text-green-500" },
          { label: "Best Score", value: kpis ? `${kpis.bestScore}%` : null, icon: Award, color: "text-purple-500" },
          { label: "Practice Hours", value: kpis ? `${kpis.practiceHoursTotal}h` : null, icon: Clock, color: "text-orange-500" },
          { label: "Current Streak", value: kpis ? `${kpis.currentStreak} days` : null, icon: Flame, color: "text-red-500" },
          { label: "Longest Streak", value: kpis ? `${kpis.longestStreak} days` : null, icon: Zap, color: "text-yellow-500" },
          { label: "Questions Answered", value: kpis?.questionsAnswered, icon: HelpCircle, color: "text-cyan-500" },
          { label: "AI Readiness", value: kpis ? `${kpis.aiReadiness}%` : null, icon: BrainCircuit, color: "text-pink-500" },
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                {loadingKPIs ? <Skeleton className="h-7 w-16" /> : <p className="text-xl font-bold">{stat.value}</p>}
              </div>
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* AI Coach Dashboard */}
      <motion.div variants={item}>
        <AICoachDashboard data={aiCoach} isLoading={loadingAICoach} />
      </motion.div>

      {/* Readiness Cards */}
      <motion.div variants={item}>
        <ReadinessCards companies={companyReadiness} roles={roleReadiness} isLoading={loadingCompany || loadingRole} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: Score Trend */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Score Trend</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loadingTrend ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                      <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar: Heatmap Summary */}
        <motion.div variants={item}>
          <Card className="border-border shadow-sm h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Practice Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {heatmap?.slice(-56).map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} sessions`}
                    className={`size-3.5 rounded-sm ${
                      day.count === 0 ? "bg-muted" :
                      day.count === 1 ? "bg-green-300 dark:bg-green-800" :
                      day.count === 2 ? "bg-green-400 dark:bg-green-700" :
                      "bg-green-500 dark:bg-green-600"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-0.5">
                  <div className="size-3 rounded-sm bg-muted" />
                  <div className="size-3 rounded-sm bg-green-300 dark:bg-green-800" />
                  <div className="size-3 rounded-sm bg-green-400 dark:bg-green-700" />
                  <div className="size-3 rounded-sm bg-green-500 dark:bg-green-600" />
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Topics */}
      <motion.div variants={item}>
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Topic Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {loadingTopics ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              topics?.map(topic => (
                <div key={topic.topic} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-28 shrink-0">{topic.topic}</span>
                  <div className="flex-1">
                    <Progress value={topic.accuracy} className="h-2" />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">{topic.accuracy}%</span>
                  <div className="w-6 flex justify-center">
                    {topic.trend === "up" && <TrendingUp className="size-4 text-green-500" />}
                    {topic.trend === "down" && <TrendingDown className="size-4 text-red-500" />}
                    {topic.trend === "stable" && <Minus className="size-4 text-muted-foreground" />}
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">{topic.attempts} attempts</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={item}>
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingAchievements ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements?.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                      ach.unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm truncate">{ach.title}</h4>
                        {ach.unlocked && <Badge variant="secondary" className="text-[10px] shrink-0">Unlocked</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{ach.description}</p>
                      <div className="space-y-1">
                        <Progress value={(ach.progress / ach.target) * 100} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground">{ach.progress} / {ach.target}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
