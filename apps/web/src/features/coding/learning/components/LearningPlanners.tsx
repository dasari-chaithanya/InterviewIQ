"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function StudyCalendar() {
  const daysInMonth = 30;
  
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarIcon className="size-4" />
          Monthly Study Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-muted-foreground pb-2">{d}</div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            if (i < 2 || i >= 32) return <div key={i} className="aspect-square opacity-0" />;
            
            // Mock data coloring
            const isToday = i === 18;
            const practiced = i < 18 && Math.random() > 0.3;
            
            return (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`aspect-square rounded-md flex items-center justify-center text-xs cursor-default
                      ${isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}
                      ${practiced ? "bg-green-500/20 text-green-700 dark:text-green-400 font-bold" : i < 18 ? "bg-red-500/10 text-muted-foreground" : "bg-muted/30 text-muted-foreground"}
                    `}>
                      {i - 1}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isToday ? "Today" : practiced ? "Practiced!" : i < 18 ? "Missed" : "Upcoming"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function PracticePlanner() {
  const plans = [
    { label: "Today", task: "Review 2 Hash Map problems", time: "30m" },
    { label: "Tomorrow", task: "Start Binary Search (Easy)", time: "45m" },
    { label: "This Week", task: "Complete Arrays Assessment", time: "1h 30m" },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="size-4" />
          Practice Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {plans.map((plan, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary shrink-0">
              <CheckCircle2 className="size-3" />
            </div>
            <div className="space-y-1 w-full">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">{plan.label}</span>
                <span className="text-muted-foreground">{plan.time}</span>
              </div>
              <p className="text-sm">{plan.task}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function LearningProgress() {
  const events = [
    { title: "Company Ready", active: false },
    { title: "Mastered DP", active: false },
    { title: "First Hard Problem", active: true },
    { title: "100 Problems", active: true },
    { title: "Started Coding", active: true },
  ];

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Learning Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative space-y-0 before:absolute before:inset-0 before:ml-[0.55rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border before:to-transparent">
          {events.map((e, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pb-6 last:pb-0">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full border bg-background shrink-0 z-10 
                ${e.active ? "border-primary text-primary" : "border-muted-foreground opacity-50"}`}
              >
                {e.active && <CheckCircle2 className="size-3 fill-primary text-background" />}
              </div>
              <div className={`w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] text-sm font-medium ${e.active ? "text-foreground" : "text-muted-foreground"}`}>
                {e.title}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
