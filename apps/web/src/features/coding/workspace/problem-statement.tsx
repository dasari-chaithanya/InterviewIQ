"use client";

import { useProblem } from "../hooks/use-coding";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Lightbulb, MessageSquare, BookOpen } from "lucide-react";
import { Difficulty } from "../services/coding.types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export function ProblemStatement({ problemId }: { problemId: string }) {
  const { data: problem, isLoading } = useProblem(problemId);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="pt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <FileText className="size-12 mb-4 opacity-20" />
        <p>Problem not found.</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Easy": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Medium": return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      case "Hard": return "text-red-500 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <Tabs defaultValue="description" className="w-full flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="bg-transparent h-12 p-0 w-full justify-start gap-6 rounded-none">
            <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full bg-transparent shadow-none">
              <FileText className="size-4 mr-2" /> Description
            </TabsTrigger>
            <TabsTrigger value="editorial" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full bg-transparent shadow-none">
              <BookOpen className="size-4 mr-2" /> Editorial
            </TabsTrigger>
            <TabsTrigger value="solutions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-full bg-transparent shadow-none">
              <MessageSquare className="size-4 mr-2" /> Solutions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="description" className="flex-1 overflow-y-auto p-5 m-0 outline-none">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight">{problem.id}. {problem.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <Badge variant="outline" className={cn("font-medium", getDifficultyColor(problem.difficulty))}>
                  {problem.difficulty}
                </Badge>
                {problem.companies.slice(0, 3).map(c => (
                  <Badge key={c.name} variant="secondary" className="font-normal text-xs">{c.name}</Badge>
                ))}
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{problem.description}</ReactMarkdown>
            </div>

            {problem.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Examples</h3>
                {problem.examples.map((ex, i) => (
                  <div key={i} className="space-y-2">
                    <p className="font-medium text-sm">Example {i + 1}:</p>
                    <div className="p-4 rounded-lg bg-muted/50 border font-mono text-sm space-y-2">
                      <div><span className="font-semibold select-none text-muted-foreground">Input:</span> {ex.input}</div>
                      <div><span className="font-semibold select-none text-muted-foreground">Output:</span> {ex.output}</div>
                      {ex.explanation && <div><span className="font-semibold select-none text-muted-foreground">Explanation:</span> {ex.explanation}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {problem.constraints.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Constraints</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {problem.constraints.map((c, i) => (
                    <li key={i}><code className="bg-muted px-1.5 py-0.5 rounded text-[13px]">{c}</code></li>
                  ))}
                </ul>
              </div>
            )}

            {problem.hints.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Lightbulb className="size-4 text-yellow-500" /> AI Hints
                </h3>
                <div className="space-y-2">
                  {problem.hints.map((hint, i) => (
                    <details key={i} className="group border rounded-lg bg-muted/20">
                      <summary className="p-3 font-medium text-sm cursor-pointer select-none flex items-center justify-between">
                        <span>Hint {i + 1}</span>
                        <span className="text-xs text-muted-foreground group-open:hidden">Show</span>
                      </summary>
                      <div className="p-3 pt-0 text-sm text-muted-foreground border-t bg-muted/10">
                        {hint}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="editorial" className="p-6 m-0">
          <p className="text-sm text-muted-foreground">Editorial and official solutions will be unlocked after solving or attempting the problem.</p>
        </TabsContent>

        <TabsContent value="solutions" className="p-6 m-0">
          <p className="text-sm text-muted-foreground">Community discussions and top voted solutions.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
