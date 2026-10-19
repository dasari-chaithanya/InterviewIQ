"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useUploadResume } from "@/hooks/resume/use-resume";
import { UploadCloud, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function ResumeUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: uploadResume, isPending, isSuccess, isError, reset } = useUploadResume();

  // Simulate progress bar when uploading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      setTimeout(() => setProgress(0), 0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; // Wait for actual success to hit 100
          return prev + 10;
        });
      }, 150);
    } else if (isSuccess) {
      setTimeout(() => setProgress(100), 0);
      const timer = setTimeout(() => {
        setProgress(0);
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    } else if (isError) {
      setTimeout(() => setProgress(0), 0);
    }
    
    return () => clearInterval(interval);
  }, [isPending, isSuccess, isError, reset]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    setFileError(null);
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File exceeds the 5MB size limit.");
      return false;
    }
    if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
      setFileError("Only PDF or DOCX files are allowed.");
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (isPending || isSuccess) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        uploadResume(file);
      }
    }
  }, [isPending, isSuccess, uploadResume]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        uploadResume(file);
      }
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isPending && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer bg-card overflow-hidden",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          isPending && "pointer-events-none opacity-80"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
        />

        {isSuccess ? (
          <div className="flex flex-col items-center text-green-500 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="size-12 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Upload Complete</h3>
            <p className="text-sm text-muted-foreground mt-1">Your resume has been saved to your library.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className={cn("p-4 rounded-full bg-primary/10 mb-4 transition-transform duration-300", isDragging && "scale-110")}>
              <UploadCloud className="size-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Drag & drop your resume</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Supports PDF and DOCX up to 5MB. We&apos;ll extract your skills and experience to tailor your interviews.
            </p>
            
            <Button variant="outline" className="mt-6 pointer-events-none">
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {isPending && (
        <div className="mt-6 space-y-2 animate-in fade-in">
          <div className="flex justify-between text-sm font-medium">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {fileError && (
        <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-in slide-in-from-top-2">
          <XCircle className="size-4 shrink-0" />
          {fileError}
        </div>
      )}
    </div>
  );
}
