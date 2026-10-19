"use client";

import { useAnalyticsPreview } from "@/hooks/dashboard/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTheme } from "next-themes";

export function AnalyticsPreview() {
  const { data, isLoading } = useAnalyticsPreview();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <Card className="border-border shadow-sm h-full flex flex-col">
        <CardHeader>
          <Skeleton className="h-6 w-[140px]" />
          <Skeleton className="h-4 w-[220px]" />
        </CardHeader>
        <CardContent className="flex-1 min-h-[200px]">
          <Skeleton className="h-full w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const strokeColor = theme === "dark" ? "#3b82f6" : "#2563eb"; // tailwind blue-500 / blue-600


  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Weekly Score Trend</CardTitle>
        <CardDescription>Your average score progression over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px] w-full">
        {data && data.weeklyTrend && data.weeklyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.weeklyTrend} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)'
                }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke={strokeColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Not enough data to display trend. Complete more interviews!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
