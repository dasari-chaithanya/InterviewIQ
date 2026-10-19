"use client";

import { Terminal, ListChecks, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceStore } from "../store/use-workspace-store";
import { TestCasePanel } from "./TestCasePanel";
import { OutputPanel } from "./OutputPanel";
import { ExecutionHistoryPanel } from "./ExecutionHistoryPanel";
import { SubmissionTabContent } from "../../submission/components/SubmissionTabContent";
import { Upload } from "lucide-react";

export function ConsolePanel({ problemId }: { problemId: string }) {
  const { activeConsoleTab, setActiveConsoleTab } = useWorkspaceStore();

  return (
    <div className="h-full bg-card flex flex-col relative border-t border-border">
      <Tabs value={activeConsoleTab} onValueChange={setActiveConsoleTab} className="h-full flex flex-col">
        <div className="h-10 border-b border-border bg-muted/30 px-2 flex items-center shrink-0 overflow-x-auto">
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger 
              value="testcases" 
              className="data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs"
            >
              <ListChecks className="mr-2 size-3.5" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger 
              value="output" 
              className="data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs"
            >
              <Terminal className="mr-2 size-3.5" />
              Output
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs"
            >
              <History className="mr-2 size-3.5" />
              History
            </TabsTrigger>
            <TabsTrigger 
              value="submission" 
              className="data-[state=active]:bg-card data-[state=active]:shadow-sm text-xs font-semibold text-green-600 data-[state=active]:text-green-700"
            >
              <Upload className="mr-2 size-3.5" />
              Submission
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto bg-background/50">
          <TabsContent value="testcases" className="m-0 h-full">
            <TestCasePanel />
          </TabsContent>

          <TabsContent value="output" className="m-0 h-full">
            <OutputPanel />
          </TabsContent>

          <TabsContent value="history" className="m-0 h-full">
            <ExecutionHistoryPanel problemId={problemId} />
          </TabsContent>

          <TabsContent value="submission" className="m-0 h-full">
            <SubmissionTabContent problemId={problemId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
