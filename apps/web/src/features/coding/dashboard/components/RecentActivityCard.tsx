"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, XCircle, Code } from "lucide-react";
import { AttemptHistory } from "@/services/coding/coding.types";
import { cn } from "@/lib/utils";

interface RecentActivityCardProps {
  activity: AttemptHistory[];
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  const displayActivity = activity.slice(0, 5);

  return (
    <Card className="h-full border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-blue-500" />
            Recent Activity
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivity.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No recent activity found. Start solving problems!
          </div>
        ) : (
          <div className="relative border-l border-border/50 ml-3 space-y-6">
            {displayActivity.map((item, i) => {
              const isAccepted = item.status === "Accepted";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-6"
                >
                  <div className="absolute -left-[9px] top-1 bg-background rounded-full">
                    {isAccepted ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                      <XCircle className="size-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-foreground">
                        {item.problemId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span className={cn(isAccepted ? "text-green-600/80" : "text-red-600/80", "font-medium")}>
                          {item.status}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Code className="size-3"/> {item.language}</span>
                      </p>
                    </div>
                    <div className="text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/70">
                        {item.runtime}ms • {item.memory}MB
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
