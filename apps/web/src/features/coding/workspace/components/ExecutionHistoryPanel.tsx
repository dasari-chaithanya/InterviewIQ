"use client";

import { useWorkspaceStore } from "../store/use-workspace-store";
import { History, Trash2, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExecutionHistoryPanelProps {
  problemId: string;
}

export function ExecutionHistoryPanel({ problemId }: ExecutionHistoryPanelProps) {
  const { executionHistory, clearHistory } = useWorkspaceStore();
  const history = executionHistory[problemId] || [];

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <History className="size-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No previous executions found.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-sm font-semibold">Previous Runs ({history.length})</span>
        <Button variant="ghost" size="sm" onClick={() => clearHistory(problemId)} className="text-muted-foreground hover:text-red-500">
          <Trash2 className="size-4 mr-2" /> Clear History
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {history.map((run) => (
            <div key={run.id} className="border rounded-lg p-3 bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "font-semibold text-sm",
                    run.status === 'Accepted' ? "text-green-500" : "text-red-500"
                  )}>
                    {run.status}
                  </span>
                  <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-sm bg-muted">
                    {run.language}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span>{new Date(run.timestamp).toLocaleTimeString()}</span>
                  <span>{run.runtime}ms</span>
                  <span>{run.memory}MB</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8">
                <RotateCcw className="size-3 mr-2" /> Load
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
