"use client";

import { useState } from "react";
import { AIReviewResult } from "../../review/store/use-review-store";
import { SubmissionResult } from "../../submission/store/use-submission-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImprovementChecklist({ review }: { review: AIReviewResult }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tasks = [
    { id: 'naming', label: 'Improve variable naming', desc: 'Replace single-letter variables' },
    { id: 'complexity', label: 'Reduce time complexity', desc: `Target: ${review.expectedTimeComplexity}` },
    { id: 'edge_cases', label: 'Handle edge cases', desc: 'Add validation for missing cases' },
    { id: 'comments', label: 'Add documentation', desc: 'Comment complex logic blocks' },
    { id: 'refactor', label: 'Extract helper functions', desc: 'Improve code modularity' },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="size-4" />
          Improvement Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
            <Checkbox 
              id={task.id} 
              checked={checked[task.id]} 
              onCheckedChange={() => toggle(task.id)}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor={task.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {task.label}
              </label>
              <p className="text-xs text-muted-foreground">{task.desc}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SubmissionTimelineCard({ submission, review }: { submission: SubmissionResult, review: AIReviewResult }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4" />
          Event Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {[
            { label: 'Submission Started', time: new Date(submission.timestamp - 3000).toLocaleTimeString() },
            { label: 'Compilation Finished', time: new Date(submission.timestamp - 2000).toLocaleTimeString() },
            { label: 'Hidden Tests Evaluated', time: new Date(submission.timestamp).toLocaleTimeString() },
            { label: 'AI Review Generated', time: new Date(submission.timestamp + 4000).toLocaleTimeString() },
            { label: 'Report Published', time: new Date(submission.timestamp + 4500).toLocaleTimeString() },
          ].map((event, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border bg-background shrink-0 z-10 border-primary text-primary" />
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border bg-card shadow-sm">
                <div className="font-semibold text-xs">{event.label}</div>
                <div className="text-[10px] text-muted-foreground">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RelatedProblemsCard() {
  const problems = [
    { id: '3sum', title: '3Sum', difficulty: 'Medium', acceptance: '34.2%' },
    { id: 'subarray-sum', title: 'Subarray Sum Equals K', difficulty: 'Medium', acceptance: '43.8%' },
    { id: 'valid-anagram', title: 'Valid Anagram', difficulty: 'Easy', acceptance: '64.1%' },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Next Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {problems.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 border rounded-lg hover:bg-muted/50 transition-colors">
            <div>
              <div className="font-medium text-sm">{p.title}</div>
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span className={p.difficulty === 'Easy' ? "text-green-600" : "text-orange-600"}>{p.difficulty}</span>
                <span>•</span>
                <span>{p.acceptance} Acc</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full">
              <ArrowRight className="size-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
