"use client";

import { useWorkspaceStore } from "../store/use-workspace-store";
import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditorPanelProps {
  problemId: string;
}

export function EditorPanel({ problemId }: EditorPanelProps) {
  const { 
    language, 
    theme, 
    fontSize, 
    wordWrap, 
    minimap, 
    code, 
    updateCode 
  } = useWorkspaceStore();

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const currentCodeKey = `${problemId}_${language}`;
  const currentCode = code[currentCodeKey] || `// Write your ${language} solution here...`;

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateCode(problemId, language, value);
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-full w-full bg-[#1e1e1e] relative">
      <Editor
        height="100%"
        width="100%"
        language={language === 'cpp' ? 'cpp' : language}
        theme={theme}
        value={currentCode}
        onChange={handleEditorChange}
        loading={
          <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-[#1e1e1e]">
            <Loader2 className="size-8 animate-spin" />
          </div>
        }
        options={{
          fontSize,
          wordWrap,
          minimap: { enabled: minimap },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
