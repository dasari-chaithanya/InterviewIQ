"use client";

import { useSubmissionStore } from "../../submission/store/use-submission-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText, Play, ArrowRightLeft, BookmarkPlus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Generates some mock historical attempts to pad the table if local storage is empty or small
const generateMockHistory = (count: number) => {
  const problems = ["Two Sum", "Add Two Numbers", "Longest Substring", "Median of Arrays", "Valid Parentheses", "Merge Intervals"];
  const difficulties = ["Easy", "Medium", "Medium", "Hard", "Easy", "Medium"];
  const languages = ["typescript", "python", "java", "cpp", "go"];
  const statuses = ["Accepted", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Accepted"];
  
  return Array.from({ length: count }).map((_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      problemId: `prob-${Math.floor(Math.random() * problems.length)}`,
      problemTitle: problems[Math.floor(Math.random() * problems.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      status,
      runtime: status === 'Accepted' ? Math.floor(Math.random() * 80) + 20 : null,
      memory: status === 'Accepted' ? parseFloat((Math.random() * 20 + 30).toFixed(1)) : null,
      score: status === 'Accepted' ? Math.floor(Math.random() * 20) + 80 : 0,
      timestamp: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000 - i * 1000000,
    };
  });
};

const mockHistory = generateMockHistory(15);

interface AttemptTableProps {
  onCompare: (id: string) => void;
}

export function AttemptTable({ onCompare }: AttemptTableProps) {
  const { latestSubmissions } = useSubmissionStore();
  
  // Combine real local submissions with mock history
  const allSubmissions = [
    ...Object.values(latestSubmissions).map(sub => ({
      id: sub.id,
      problemId: sub.problemId,
      problemTitle: "Two Sum", // We only implemented Two Sum so far
      difficulty: "Easy",
      language: sub.language,
      status: sub.status,
      runtime: sub.runtime,
      memory: sub.memory,
      score: sub.status === 'Accepted' ? 85 : 0,
      timestamp: sub.timestamp,
    })),
    ...mockHistory
  ].sort((a, b) => b.timestamp - a.timestamp);

  const getStatusColor = (status: string) => {
    if (status === 'Accepted') return "text-green-600 bg-green-500/10 border-green-500/20";
    if (status === 'Wrong Answer') return "text-red-600 bg-red-500/10 border-red-500/20";
    return "text-orange-600 bg-orange-500/10 border-orange-500/20";
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return "text-green-500";
    if (diff === 'Medium') return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Runtime</TableHead>
            <TableHead>Memory</TableHead>
            <TableHead>Language</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSubmissions.map((sub, idx) => (
            <TableRow key={sub.id} className="group transition-colors hover:bg-muted/50">
              <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                {new Date(sub.timestamp).toLocaleDateString()} {new Date(sub.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </TableCell>
              <TableCell>
                <div className="font-medium hover:underline cursor-pointer flex items-center gap-2">
                  {sub.problemTitle}
                  <span className={`text-xs ${getDifficultyColor(sub.difficulty)}`}>{sub.difficulty}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`whitespace-nowrap ${getStatusColor(sub.status || "")}`}>
                  {sub.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {sub.runtime ? `${sub.runtime} ms` : 'N/A'}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {sub.memory ? `${sub.memory} MB` : 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {sub.language}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/coding/report/${sub.id}`} className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4 text-primary" /> View Report
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/coding/workspace/${sub.problemId}`} className="cursor-pointer">
                        <Play className="mr-2 h-4 w-4 text-green-500" /> Retry Problem
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCompare(sub.id)} className="cursor-pointer">
                      <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-500" /> Compare
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <BookmarkPlus className="mr-2 h-4 w-4" /> Bookmark
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
