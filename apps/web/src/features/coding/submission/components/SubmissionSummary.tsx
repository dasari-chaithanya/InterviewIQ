"use client";

import { useSubmissionStore } from "../store/use-submission-store";
import { CheckCircle2, Clock, Cpu, FlaskConical, Hash, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface SubmissionSummaryProps {
  problemId: string;
}

export function SubmissionSummary({ problemId }: SubmissionSummaryProps) {
  const { latestSubmissions } = useSubmissionStore();
  const submission = latestSubmissions[problemId];

  if (!submission) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b pb-4">
        <div>
          <h3 className={cn(
            "text-2xl font-bold mb-1",
            submission.status === 'Accepted' ? "text-green-500" : "text-red-500"
          )}>
            {submission.status}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Submitted at {new Date(submission.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="text-sm font-mono text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border flex items-center gap-2">
          <Hash className="size-3" /> {submission.id}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-500">
                <Clock className="size-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Runtime</div>
                <div className="text-xl font-bold font-mono tracking-tight">{submission.runtime} ms</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-purple-500/10 text-purple-500">
                <Cpu className="size-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Memory</div>
                <div className="text-xl font-bold font-mono tracking-tight">{submission.memory} MB</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn(
                "p-2.5 rounded-full",
                submission.hiddenTestsPassed === submission.hiddenTestsTotal ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                <FlaskConical className="size-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Hidden Tests</div>
                <div className="text-xl font-bold font-mono tracking-tight text-foreground">
                  {submission.hiddenTestsPassed} <span className="text-muted-foreground text-sm">/ {submission.hiddenTestsTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-orange-500/10 text-orange-500">
                <FileCode2 className="size-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Language</div>
                <div className="text-xl font-bold font-mono tracking-tight capitalize">{submission.language}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
