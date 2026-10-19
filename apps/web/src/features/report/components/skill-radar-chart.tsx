"use client";

import { RadarDataPoint } from "@/services/report/report.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export function SkillRadarChart({ data }: { data: RadarDataPoint[] }) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Skill Radar</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
            </RechartsRadar>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
