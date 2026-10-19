"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

// Generates a mock heatmap data grid
const generateHeatmap = () => {
  const weeks = 52;
  const daysPerWeek = 7;
  const grid = [];
  
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < daysPerWeek; d++) {
      // Simulate more activity closer to present
      const isRecent = w > 40;
      const baseProbability = isRecent ? 0.6 : 0.3;
      
      let level = 0;
      if (Math.random() < baseProbability) {
        const rand = Math.random();
        if (rand < 0.5) level = 1;
        else if (rand < 0.8) level = 2;
        else if (rand < 0.95) level = 3;
        else level = 4;
      }
      
      week.push({ level, date: new Date(Date.now() - (weeks - w) * 7 * 24 * 60 * 60 * 1000 + d * 24 * 60 * 60 * 1000).toLocaleDateString() });
    }
    grid.push(week);
  }
  return grid;
};

export function ActivityHeatmap() {
  const heatmapGrid = generateHeatmap();

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-300 dark:bg-green-900/50";
      case 2: return "bg-green-400 dark:bg-green-700/60";
      case 3: return "bg-green-500 dark:bg-green-500/80";
      case 4: return "bg-green-600 dark:bg-green-400";
      default: return "bg-muted/50";
    }
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Submission Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="inline-flex gap-1">
            <TooltipProvider>
              {heatmapGrid.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <Tooltip key={dIdx}>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (wIdx * 0.01) + (dIdx * 0.005) }}
                          className={`size-3 rounded-sm ${getLevelColor(day.level)} cursor-pointer hover:ring-1 hover:ring-foreground transition-all`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{day.level === 0 ? "No" : day.level * 3} submissions on {day.date}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2">
          <span>Less</span>
          <div className="size-3 rounded-sm bg-muted/50" />
          <div className="size-3 rounded-sm bg-green-300 dark:bg-green-900/50" />
          <div className="size-3 rounded-sm bg-green-400 dark:bg-green-700/60" />
          <div className="size-3 rounded-sm bg-green-500 dark:bg-green-500/80" />
          <div className="size-3 rounded-sm bg-green-600 dark:bg-green-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
