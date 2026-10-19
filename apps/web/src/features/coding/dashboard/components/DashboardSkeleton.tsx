"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center py-6 border-b">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-24">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="size-6 rounded-md" />
              </div>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[200px]">
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>

          <Card className="h-[300px]">
            <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2 w-1/2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-[200px]">
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
          
          <Card className="h-[300px]">
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function DashboardEmptyState() {
  return (
    <div className="py-20 text-center space-y-4">
      <Skeleton className="size-16 rounded-full mx-auto" />
      <h3 className="text-xl font-semibold">No Data Available</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        We couldn't load your coding analytics at this time.
      </p>
    </div>
  );
}
