"use client";

import { SubmissionResult } from "../../submission/store/use-submission-store";
import { AIReviewResult } from "../../review/store/use-review-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Share2, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CodingReportHeaderProps {
  submission: SubmissionResult;
  review: AIReviewResult;
}

export function CodingReportHeader({ submission, review }: CodingReportHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b pb-6">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-2 mb-2">
          <Link href={`/coding/workspace/${submission.problemId}`}>
            <ArrowLeft className="size-4 mr-2" /> Back to Workspace
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Two Sum</h1>
          <Badge variant="outline" className={cn(
            submission.status === 'Accepted' ? "text-green-600 border-green-600/20 bg-green-600/10" : "text-red-600 border-red-600/20 bg-red-600/10"
          )}>
            {submission.status}
          </Badge>
          <Badge variant="secondary" className="capitalize">{submission.language}</Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-4">
          <span>Submission ID: <span className="font-mono text-foreground">{submission.id}</span></span>
          <span>•</span>
          <span>{new Date(submission.timestamp).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => toast.info("Downloading JSON...")}>
          <Download className="size-4 mr-2" /> JSON
        </Button>
        <Button variant="outline" onClick={() => toast.info("Exporting PDF...")}>
          <FileDown className="size-4 mr-2" /> Export PDF
        </Button>
        <Button onClick={() => toast.info("Sharing link copied!")}>
          <Share2 className="size-4 mr-2" /> Share
        </Button>
      </div>
    </div>
  );
}
