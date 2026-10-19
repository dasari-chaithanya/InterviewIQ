"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useCodingStore } from "../store/coding-store";
import { useProblem } from "../hooks/use-coding";
import { Language } from "../services/coding.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Maximize2, Minimize2, Settings, RefreshCw, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const SUPPORTED_LANGUAGES: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python 3" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

export function CodeEditor({ problemId }: { problemId: string }) {
  const { state, dispatch } = useCodingStore();
  const { data: problem, isLoading } = useProblem(problemId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // When problem loads and no code is in state, set starter code
  useEffect(() => {
    if (problem && !state.code) {
      dispatch({ type: "SET_CODE", payload: problem.starterCode[state.language] || "" });
    }
  }, [problem, state.language, state.code, dispatch]);

  const handleLanguageChange = (value: Language) => {
    dispatch({ type: "SET_LANGUAGE", payload: value });
    if (problem) {
      // Overwrite code when language changes
      dispatch({ type: "SET_CODE", payload: problem.starterCode[value] || "" });
    }
  };

  if (isLoading || !mounted) {
    return <Skeleton className="h-full w-full rounded-none" />;
  }

  return (
    <div className="h-full flex flex-col bg-card border-l border-r relative group">
      {/* Editor Header / Toolbar */}
      <div className="h-12 flex items-center justify-between px-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Select value={state.language} onValueChange={(val) => handleLanguageChange(val as Language)}>
            <SelectTrigger className="h-8 w-[140px] text-xs font-medium border-transparent bg-muted/50 hover:bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map(lang => (
                <SelectItem key={lang.value} value={lang.value} className="text-xs">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => dispatch({ type: "SET_CODE", payload: problem?.starterCode[state.language] || "" })}
            title="Reset to starter code"
          >
            <RefreshCw className="size-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => dispatch({ type: "SET_THEME", payload: state.theme === "vs-dark" ? "light" : "vs-dark" })}
            title="Toggle Theme"
          >
            {state.theme === "vs-dark" ? <Sun className="size-4 text-muted-foreground" /> : <Moon className="size-4 text-muted-foreground" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-8" title="Settings">
            <Settings className="size-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => dispatch({ type: "TOGGLE_FULLSCREEN" })}
            title="Toggle Fullscreen"
          >
            {state.isFullscreen ? <Minimize2 className="size-4 text-muted-foreground" /> : <Maximize2 className="size-4 text-muted-foreground" />}
          </Button>
        </div>
      </div>

      {/* Monaco Editor Wrapper */}
      <div className={cn("flex-1 overflow-hidden relative", state.isFullscreen && "fixed inset-0 z-50 bg-background")}>
        {state.isFullscreen && (
          <div className="absolute top-4 right-4 z-10 bg-background rounded-md shadow-lg border p-1">
             <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "TOGGLE_FULLSCREEN" })}>
               <Minimize2 className="size-4 mr-2" /> Exit Fullscreen
             </Button>
          </div>
        )}
        <Editor
          height="100%"
          language={state.language}
          theme={state.theme}
          value={state.code}
          onChange={(value) => dispatch({ type: "SET_CODE", payload: value || "" })}
          options={{
            fontSize: state.fontSize,
            wordWrap: state.wordWrap,
            minimap: { enabled: state.minimap },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            lineNumbersMinChars: 3,
            roundedSelection: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          }}
          loading={<Skeleton className="h-full w-full rounded-none" />}
        />
      </div>
    </div>
  );
}
