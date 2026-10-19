"use client";

import { useDashboardStats } from "@/hooks/dashboard/use-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsGrid() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        // Dynamically get the Lucide icon
        const IconComponent = ((Icons as unknown) as Record<string, React.ElementType>)[stat.icon] || Icons.Activity;

        return (
          <Card key={stat.id} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComponent className="size-4 text-primary" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
                  <span className={cn(
                    "flex items-center",
                    stat.trend > 0 ? "text-green-500" : stat.trend < 0 ? "text-red-500" : ""
                  )}>
                    {stat.trend > 0 ? "+" : ""}{stat.trend}%
                  </span>
                  {" "}{stat.trendLabel}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
