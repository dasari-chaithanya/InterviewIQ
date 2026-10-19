"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CodingAnalytics } from "@/services/coding/coding.types";

interface TopicProgressCardProps {
  topics: CodingAnalytics["topicProgress"];
}

export function TopicProgressCard({ topics }: TopicProgressCardProps) {
  // Sort topics by solved count to show most active first
  const displayTopics = [...topics].sort((a, b) => b.solved - a.solved).slice(0, 5);

  return (
    <Card className="h-full border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-purple-500" />
            Topic Mastery
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {displayTopics.map((topic, i) => {
            const percentage = Math.round((topic.solved / topic.total) * 100);
            return (
              <motion.div 
                key={topic.topic}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{topic.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">{topic.solved}/{topic.total}</span>
                    <span className="font-semibold text-primary w-9 text-right">{percentage}%</span>
                  </div>
                </div>
                <Progress value={percentage} className="h-1.5" />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
