"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export function WorkspaceSkeleton() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      
      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left */}
        <div className="w-[40%] border-r p-6 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Right */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="h-14 border-b flex items-center justify-between px-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
          {/* Editor */}
          <div className="flex-1 bg-muted/20" />
          {/* Console */}
          <div className="h-[30%] border-t bg-card p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceEmptyState() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="py-24 text-center space-y-4 border rounded-xl border-dashed px-12">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <span className="text-2xl">🤷‍♂️</span>
        </div>
        <h3 className="text-xl font-semibold">Problem Not Found</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          The coding challenge you are trying to solve does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/coding/problems">Return to Library</Link>
        </Button>
      </div>
    </div>
  );
}

export function WorkspaceErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
      <div className="py-24 text-center space-y-4 border border-red-500/20 bg-red-500/5 rounded-xl px-12">
        <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-red-600">Failed to load Workspace</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We encountered an issue while setting up your coding environment.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button variant="outline" asChild>
            <Link href="/coding/problems">Back to Library</Link>
          </Button>
          <Button onClick={onRetry}>Retry</Button>
        </div>
      </div>
    </div>
  );
}
