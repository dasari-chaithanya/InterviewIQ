"use client";

import { Problem } from "@/services/coding/coding.types";
import { ArrowLeft, LayoutTemplate, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWorkspaceStore } from "../store/use-workspace-store";

interface WorkspaceHeaderProps {
  problem: Problem;
}

export function WorkspaceHeader({ problem }: WorkspaceHeaderProps) {
  const { isFullscreen, setFullscreen } = useWorkspaceStore();

  return (
    <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Link href={`/coding/problems/${problem.id}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate max-w-[200px] md:max-w-xs">
            {problem.title}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            problem.difficulty === "Easy" ? "text-green-600 border-green-600/20 bg-green-600/10" :
            problem.difficulty === "Medium" ? "text-orange-600 border-orange-600/20 bg-orange-600/10" :
            "text-red-600 border-red-600/20 bg-red-600/10"
          }`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex"
          onClick={() => setFullscreen(!isFullscreen)}
        >
          <LayoutTemplate className="size-4 mr-2" />
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
        <Button variant="ghost" size="icon" className="size-8">
          <Settings className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
