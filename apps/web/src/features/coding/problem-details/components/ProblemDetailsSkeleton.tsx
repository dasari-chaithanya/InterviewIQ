"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProblemDetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse mt-4">
      {/* Back button skeleton */}
      <Skeleton className="h-8 w-32 mb-4" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <Skeleton className="h-10 w-3/4 max-w-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      
      {/* Metadata tags */}
      <div className="flex gap-3 border-b pb-6">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            
            <div className="pt-4 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
          
          {/* Examples */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProblemDetailsEmptyState() {
  return (
    <div className="py-24 text-center space-y-4 border rounded-xl border-dashed mt-8">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto">
        <span className="text-2xl">🤷‍♂️</span>
      </div>
      <h3 className="text-xl font-semibold">Problem Not Found</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        The coding challenge you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild className="mt-4">
        <Link href="/coding/problems">Back to Library</Link>
      </Button>
    </div>
  );
}

export function ProblemDetailsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-24 text-center space-y-4 border border-red-500/20 bg-red-500/5 rounded-xl mt-8">
      <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-xl font-semibold text-red-600">Error Loading Problem</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        We couldn&apos;t connect to the servers to fetch this problem&apos;s details.
      </p>
      <div className="flex items-center justify-center gap-3 mt-4">
        <Button variant="outline" asChild>
          <Link href="/coding/problems">Back to Library</Link>
        </Button>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
}
