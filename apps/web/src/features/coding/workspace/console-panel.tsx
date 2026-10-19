"use client";

import { useState } from "react";
import { useCodingStore } from "../store/coding-store";
import { useTestCases } from "../hooks/use-coding";
import { ExecutionResult } from "../services/coding.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, AlertCircle, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsolePanelProps {
  problemId: string;
  executionResult: ExecutionResult | null;
  isExecuting: boolean;
}

export function ConsolePanel({ problemId, executionResult, isExecuting }: ConsolePanelProps) {
  const { state, dispatch } = useCodingStore();
  const { data: testCases, isLoading } = useTestCases(problemId);
  const [activeTestCaseId, setActiveTestCaseId] = useState<string | null>(null);

  // Auto-select first test case when loaded
  if (testCases && testCases.length > 0 && !activeTestCaseId) {
    setActiveTestCaseId(testCases[0].id);
  }

  const activeTestCase = testCases?.find(tc => tc.id === activeTestCaseId);



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted": return <CheckCircle2 className="size-4" />;
      case "Wrong Answer": return <XCircle className="size-4" />;
      default: return <AlertCircle className="size-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-t shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <div className="h-10 flex items-center justify-between px-2 border-b bg-muted/10">
        <Tabs 
          value={state.consoleTab} 
          onValueChange={(val: string) => dispatch({ type: "SET_CONSOLE_TAB", payload: val as "testcases" | "result" })}
          className="w-full"
        >
          <TabsList className="h-full bg-transparent p-0 gap-2">
            <TabsTrigger 
              value="testcases" 
              className="data-[state=active]:bg-muted data-[state=active]:text-foreground h-8 text-xs px-3 rounded-md shadow-none"
            >
              Test Cases
            </TabsTrigger>
            <TabsTrigger 
              value="result" 
              disabled={!executionResult && !isExecuting}
              className="data-[state=active]:bg-muted data-[state=active]:text-foreground h-8 text-xs px-3 rounded-md shadow-none"
            >
              Test Result
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <button 
          onClick={() => dispatch({ type: "TOGGLE_CONSOLE" })}
          className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
        >
          <ChevronDown className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 relative">
        {state.consoleTab === "testcases" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {testCases?.filter(tc => !tc.isHidden).map((tc, i) => (
                    <button
                      key={tc.id}
                      onClick={() => setActiveTestCaseId(tc.id)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-md transition-colors border",
                        activeTestCaseId === tc.id 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-muted/50 hover:bg-muted border-transparent"
                      )}
                    >
                      Case {i + 1}
                    </button>
                  ))}
                </div>
                
                {activeTestCase && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-muted-foreground">Input:</h4>
                      <pre className="p-3 bg-muted/50 rounded-lg text-xs font-mono border overflow-x-auto whitespace-pre-wrap">{activeTestCase.input}</pre>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-muted-foreground">Expected Output:</h4>
                      <pre className="p-3 bg-muted/50 rounded-lg text-xs font-mono border overflow-x-auto">{activeTestCase.expectedOutput}</pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {state.consoleTab === "result" && (
          <div className="space-y-4 h-full">
            {isExecuting ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground animate-pulse">
                <Clock className="size-8 opacity-20" />
                <p className="text-sm font-medium">Evaluating your solution...</p>
              </div>
            ) : executionResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className={cn("text-lg font-bold flex items-center gap-2", 
                    executionResult.status === "Accepted" ? "text-green-500" : "text-red-500"
                  )}>
                    {getStatusIcon(executionResult.status)}
                    {executionResult.status}
                  </h3>
                  {executionResult.status === "Accepted" && (
                    <span className="text-xs text-muted-foreground font-mono">
                      Runtime: {executionResult.runtime}ms | Memory: {executionResult.memory}MB
                    </span>
                  )}
                </div>

                {executionResult.status !== "Accepted" && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-muted-foreground">Tests Passed:</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono bg-muted/50">
                        {executionResult.passedCount} / {executionResult.totalCount}
                      </Badge>
                    </div>
                  </div>
                )}

                {(executionResult.stderr || executionResult.status.includes("Error")) && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-red-500">Error Output:</h4>
                    <pre className="p-3 bg-red-500/10 text-red-600 rounded-lg text-xs font-mono border border-red-500/20 overflow-x-auto whitespace-pre-wrap">
                      {executionResult.stderr || executionResult.status}
                    </pre>
                  </div>
                )}

                {executionResult.stdout && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-muted-foreground">Console Output:</h4>
                    <pre className="p-3 bg-muted/50 rounded-lg text-xs font-mono border overflow-x-auto whitespace-pre-wrap">
                      {executionResult.stdout}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Run your code to see results here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
