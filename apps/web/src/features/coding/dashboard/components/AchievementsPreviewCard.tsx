"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Zap, Flame, Award, Shield } from "lucide-react";
import { CodingAchievement } from "@/services/coding/coding.types";
import { cn } from "@/lib/utils";

interface AchievementsPreviewCardProps {
  achievements: CodingAchievement[];
}

export function AchievementsPreviewCard({ achievements }: AchievementsPreviewCardProps) {
  // We'll mock a few locked ones if not provided
  const allAchievements = [
    { id: "1", title: "First Blood", description: "Solve your first problem", icon: "Trophy", unlockedAt: "2023-01-01" },
    { id: "2", title: "7-Day Streak", description: "Solve problems for 7 consecutive days", icon: "Flame", unlockedAt: "2023-01-10" },
    { id: "3", title: "Tree Master", description: "Solve 20 Tree problems", icon: "Star", unlockedAt: undefined },
    { id: "4", title: "Speed Coder", description: "Solve a medium problem in under 10 minutes", icon: "Zap", unlockedAt: undefined },
    { id: "5", title: "Graph Explorer", description: "Solve 10 Graph problems", icon: "Shield", unlockedAt: undefined },
    { id: "6", title: "DP Beginner", description: "Solve your first DP problem", icon: "Award", unlockedAt: "2023-02-15" }
  ];

  // Map icon names to actual Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Trophy": return Trophy;
      case "Flame": return Flame;
      case "Star": return Star;
      case "Zap": return Zap;
      case "Shield": return Shield;
      case "Award": return Award;
      default: return Trophy;
    }
  };

  return (
    <Card className="h-full border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="size-5 text-orange-400" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allAchievements.map((achievement, i) => {
            const Icon = getIcon(achievement.icon);
            const isUnlocked = !!achievement.unlockedAt;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "p-4 rounded-xl border flex flex-col items-center text-center space-y-2 transition-all",
                  isUnlocked ? "bg-primary/5 border-primary/20 hover:bg-primary/10" : "bg-muted/30 border-transparent opacity-60 grayscale"
                )}
              >
                <div className={cn(
                  "p-3 rounded-full",
                  isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{achievement.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{achievement.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
