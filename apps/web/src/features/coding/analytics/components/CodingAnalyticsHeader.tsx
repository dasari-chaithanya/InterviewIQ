"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Code2 } from "lucide-react";
import { toast } from "sonner";

export function CodingAnalyticsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Code2 className="size-8 text-primary" />
          Coding Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your problem-solving journey, identify weak spots, and prepare for top-tier interviews.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => toast.info("Opening Filters...")}>
          <Filter className="size-4 mr-2" /> Filters
        </Button>
        <Button variant="outline" onClick={() => toast.info("Exporting Analytics Data...")}>
          <Download className="size-4 mr-2" /> Export
        </Button>
      </div>
    </div>
  );
}
