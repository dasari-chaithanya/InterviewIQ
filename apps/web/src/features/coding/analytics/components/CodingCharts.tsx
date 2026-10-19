"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";

const difficultyData = [
  { name: 'Easy', solved: 65, total: 100 },
  { name: 'Medium', solved: 55, total: 150 },
  { name: 'Hard', solved: 22, total: 80 },
];
const difficultyColors = ['#22c55e', '#f59e0b', '#ef4444'];

const languageData = [
  { name: 'TypeScript', value: 65 },
  { name: 'Python', value: 20 },
  { name: 'Java', value: 10 },
  { name: 'Go', value: 5 },
];
const languageColors = ['#3b82f6', '#eab308', '#ef4444', '#0ea5e9'];

const topicData = [
  { subject: 'Arrays', A: 90, fullMark: 100 },
  { subject: 'Strings', A: 85, fullMark: 100 },
  { subject: 'Trees', A: 60, fullMark: 100 },
  { subject: 'Graphs', A: 45, fullMark: 100 },
  { subject: 'DP', A: 40, fullMark: 100 },
  { subject: 'Hash Map', A: 95, fullMark: 100 },
];

const companyData = [
  { name: 'Google', score: 65 },
  { name: 'Meta', score: 80 },
  { name: 'Amazon', score: 75 },
  { name: 'Microsoft', score: 85 },
  { name: 'Apple', score: 70 },
];

const acceptanceTrendData = Array.from({ length: 12 }).map((_, i) => ({
  name: `Week ${i + 1}`,
  rate: 45 + Math.random() * 30
}));

export function DifficultyDistributionChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Difficulty Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficultyData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={60} axisLine={false} tickLine={false} className="text-xs font-semibold" />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
              <Bar dataKey="solved" radius={[0, 4, 4, 0]} barSize={20}>
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={difficultyColors[index % difficultyColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopicMasteryRadar() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Topic Mastery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={topicData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" className="text-xs" />
              <Radar name="Mastery" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function LanguageUsageChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Language Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={languageColors[index % languageColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs">
          {languageData.map((lang, idx) => (
            <div key={lang.name} className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full" style={{ backgroundColor: languageColors[idx % languageColors.length] }} />
              <span className="text-muted-foreground font-medium">{lang.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AcceptanceTrendChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Acceptance Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={acceptanceTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }} />
              <Area type="monotone" dataKey="rate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompanyReadinessChart() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Company Readiness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-4">
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
