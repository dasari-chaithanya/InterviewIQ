"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Resume } from "@/services/resume/resume.types";
import { FileText, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ResumePreviewModalProps {
  resume: Resume | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumePreviewModal({ resume, isOpen, onClose }: ResumePreviewModalProps) {
  if (!resume) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            {resume.filename}
          </DialogTitle>
          <DialogDescription>
            Uploaded {formatDistanceToNow(new Date(resume.uploadDate), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Preview Area */}
          <div className="flex-1 bg-muted/30 p-6 overflow-auto border-r border-border flex items-center justify-center">
            {/* Mock PDF Viewer Placeholder */}
            <div className="w-full max-w-[600px] h-[800px] bg-background border shadow-sm rounded flex flex-col items-center justify-center text-muted-foreground p-8 text-center relative">
              <FileText className="size-16 opacity-20 mb-4" />
              <p className="font-medium">Document Preview</p>
              <p className="text-sm mt-2 max-w-[300px]">
                In a real application, a PDF viewer component (like react-pdf) would render the document here.
              </p>
              
              {/* Fake text lines for visual effect */}
              <div className="absolute top-12 left-12 right-12 bottom-12 opacity-10 pointer-events-none flex flex-col gap-4">
                <div className="h-8 bg-foreground w-1/2 rounded" />
                <div className="h-4 bg-foreground w-1/3 rounded" />
                <div className="h-4 bg-foreground w-full rounded mt-8" />
                <div className="h-4 bg-foreground w-full rounded" />
                <div className="h-4 bg-foreground w-5/6 rounded" />
                <div className="h-4 bg-foreground w-full rounded mt-8" />
                <div className="h-4 bg-foreground w-4/5 rounded" />
              </div>
            </div>
          </div>

          {/* Sidebar Area (Version History & Details) */}
          <div className="w-80 shrink-0 bg-card p-6 flex flex-col gap-6 overflow-auto">
            <div>
              <h4 className="font-semibold text-sm mb-4">Version History</h4>
              <div className="space-y-4">
                {resume.versions.sort((a, b) => b.versionNumber - a.versionNumber).map((v, i) => (
                  <div key={v.id} className="relative pl-6">
                    {/* Timeline Line */}
                    {i !== resume.versions.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-20px] w-px bg-border" />
                    )}
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1.5 size-[19px] rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <div className="size-2 rounded-full bg-primary" />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Version {v.versionNumber}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="size-3" />
                        {new Date(v.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">File Details</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="font-medium">{(resume.fileSize / 1024).toFixed(1)} KB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Format</dt>
                  <dd className="font-medium uppercase">{resume.filename.split('.').pop()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
