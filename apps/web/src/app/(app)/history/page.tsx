"use client";

import { motion } from "framer-motion";
import { useHistory } from "@/hooks/report/use-history";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Clock, Eye, History, Target, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();
  const router = useRouter();

  return (
    <motion.div
      className="max-w-6xl mx-auto pb-16 space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Interview History</h1>
          <p className="text-muted-foreground text-sm">Review all your past interview sessions and reports.</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : history && history.length > 0 ? (
        <motion.div variants={item}>
          <Card className="border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Interview</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Difficulty</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="hidden lg:table-cell">Duration</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(entry => (
                  <TableRow key={entry.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Building2 className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{entry.role}</p>
                          <p className="text-xs text-muted-foreground">{entry.company}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs">{entry.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className={
                        entry.difficulty === "Advanced" ? "border-purple-500 text-purple-600" :
                        entry.difficulty === "Intermediate" ? "border-blue-500 text-blue-600" :
                        "border-green-500 text-green-600"
                      }>
                        {entry.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 w-20">
                        <span className="text-sm font-bold">{entry.score}%</span>
                        <Progress value={entry.score} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="size-3.5" /> {entry.durationMinutes}m</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => router.push(`/report/${entry.sessionId}`)}
                      >
                        <Eye className="size-3.5" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={item}>
          <div className="border border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center bg-muted/30">
            <div className="p-4 rounded-full bg-muted mb-4">
              <History className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No interview history</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
              Complete your first mock interview to see your history here.
            </p>
            <Button onClick={() => router.push("/interview/setup")}>Start Interview</Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
