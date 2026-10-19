"use client";

import React, { useState } from "react";
import { useResumes, useDeleteResume } from "@/hooks/resume/use-resume";
import { Resume } from "@/services/resume/resume.types";
import { ResumePreviewModal } from "./resume-preview-modal";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, MoreHorizontal, Eye, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export function ResumeList() {
  const { data: resumes, isLoading } = useResumes();
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();
  const [previewResume, setPreviewResume] = useState<Resume | null>(null);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="rounded-md border bg-card p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return null; // The parent page will handle the empty state
  }

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>File Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resumes.map((resume) => {
              const currentVersion = Math.max(...resume.versions.map(v => v.versionNumber));
              
              return (
                <TableRow key={resume.id} className="group hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <FileText className="size-4" />
                      </div>
                      <span className="truncate max-w-[200px] sm:max-w-[300px]" title={resume.filename}>
                        {resume.filename}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        resume.status === "Ready" 
                          ? "border-green-500 text-green-600 bg-green-500/10" 
                          : "border-blue-500 text-blue-600 bg-blue-500/10"
                      }
                    >
                      {resume.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    v{currentVersion}.0
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(resume.uploadDate), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                        onClick={() => router.push(`/resume/${resume.id}/analysis`)}
                      >
                        <Sparkles className="size-3 text-blue-500" />
                        Analyze
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setPreviewResume(resume)} className="cursor-pointer">
                          <Eye className="mr-2 size-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled className="cursor-not-allowed">
                          <RefreshCw className="mr-2 size-4" />
                          Replace
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          onClick={() => deleteResume(resume.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ResumePreviewModal 
        resume={previewResume} 
        isOpen={!!previewResume} 
        onClose={() => setPreviewResume(null)} 
      />
    </>
  );
}
