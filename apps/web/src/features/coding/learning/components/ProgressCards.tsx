"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Target } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from "recharts";
import { Progress } from "@/components/ui/progress";

export function CompanyReadinessCard() {
  const companyData = [
    { name: 'Google', score: 65 },
    { name: 'Meta', score: 80 },
    { name: 'Amazon', score: 75 },
    { name: 'Microsoft', score: 85 },
    { name: 'Apple', score: 70 },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-4" />
          Company Readiness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={companyData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" width={70} axisLine={false} tickLine={false} className="text-xs font-semibold" />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                {companyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#22c55e' : entry.score > 60 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeeklyGoalsCard() {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-primary">
          <Target className="size-4" />
          Weekly Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Problems Target</span>
            <span className="text-muted-foreground">12 / 20</span>
          </div>
          <Progress value={60} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Study Hours</span>
            <span className="text-muted-foreground">4.5 / 10 hrs</span>
          </div>
          <Progress value={45} className="h-2 bg-muted [&>div]:bg-purple-500" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Hard Problems</span>
            <span className="text-muted-foreground">1 / 3</span>
          </div>
          <Progress value={33} className="h-2 bg-muted [&>div]:bg-red-500" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Target Acceptance Rate</span>
            <span className="text-muted-foreground">68% / 75%</span>
          </div>
          <Progress value={90} className="h-2 bg-muted [&>div]:bg-blue-500" />
        </div>
      </CardContent>
    </Card>
  );
}
