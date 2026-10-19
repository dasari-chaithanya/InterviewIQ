"use client";

import { motion, Variants } from "framer-motion";
import { ResumeUploader } from "@/features/resume/components/resume-uploader";
import { ResumeList } from "@/features/resume/components/resume-list";
import { useResumes } from "@/hooks/resume/use-resume";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function ResumePage() {
  const { data: resumes, isLoading } = useResumes();

  return (
    <motion.div 
      className="max-w-5xl mx-auto flex flex-col gap-8 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your resumes. Our AI will analyze them to tailor your mock interviews.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <ResumeUploader />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Your Resumes</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : resumes && resumes.length > 0 ? (
          <ResumeList />
        ) : (
          <div className="border border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center bg-muted/30">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FileText className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No resumes uploaded</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              Upload your first resume above to unlock AI-powered insights and tailored mock interviews.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
