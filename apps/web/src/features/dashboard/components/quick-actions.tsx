"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, FileText, Code2, LineChart, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const actions = [
  {
    title: "Start Interview",
    description: "Launch a new mock session",
    icon: Play,
    href: "/interview",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Practice Coding",
    description: "Solve technical challenges",
    icon: Code2,
    href: "/coding",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Update Resume",
    description: "Optimize for ATS",
    icon: FileText,
    href: "/resume",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Quick Check",
    description: "10-question MCQ diagnostic",
    icon: Zap,
    href: "/interview/quick-check",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "View Analytics",
    description: "Check your progress",
    icon: LineChart,
    href: "/analytics",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export function QuickActions() {
  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group flex flex-col items-start gap-3 rounded-lg border p-4 hover:border-primary hover:bg-muted/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
          >
            <div className={cn("p-2 rounded-md", action.bg)}>
              <action.icon className={cn("size-5", action.color)} />
            </div>
            <div>
              <h3 className="font-medium text-sm">{action.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
