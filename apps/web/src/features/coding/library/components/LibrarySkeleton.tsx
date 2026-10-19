"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LibrarySkeleton() {
  return (
    <div className="space-y-6 animate-pulse mt-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Skeleton className="h-10 w-full sm:w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32 hidden sm:block" />
        <Skeleton className="h-10 w-32 hidden md:block" />
      </div>
      
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block border rounded-md overflow-hidden">
        <div className="h-12 bg-muted/30 border-b flex items-center px-4">
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center p-4 gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-48 flex-1" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function LibraryEmptyState({ message = "No problems found matching your criteria." }: { message?: string }) {
  return (
    <div className="py-24 text-center space-y-4 border rounded-xl border-dashed">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto">
        <span className="text-2xl">🔍</span>
      </div>
      <h3 className="text-xl font-semibold">No Results</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        {message} Try adjusting your filters or search query.
      </p>
    </div>
  );
}

export function LibraryErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-24 text-center space-y-4 border border-red-500/20 bg-red-500/5 rounded-xl">
      <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-xl font-semibold text-red-600">Error Loading Problems</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        We couldn&apos;t connect to the coding platform services. Please check your connection and try again.
      </p>
      <button 
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-background border rounded-md font-medium shadow-sm hover:bg-muted transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
