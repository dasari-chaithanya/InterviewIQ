"use client";

import { useProblems } from "../hooks/use-coding";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlayCircle, Star, StarOff, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Difficulty, Status } from "../services/coding.types";

export function ProblemLibrary() {
  const { data: problems, isLoading } = useProblems();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!problems) return null;

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Easy": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Medium": return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      case "Hard": return "text-red-500 bg-red-500/10 border-red-500/20";
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "Solved": return <CheckCircle2 className="size-4 text-green-500" />;
      case "Attempted": return <PlayCircle className="size-4 text-yellow-500" />;
      case "Todo": return <div className="size-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px] text-center">Status</TableHead>
            <TableHead className="w-[50px] text-center"><Star className="size-4 mx-auto text-muted-foreground" /></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Acceptance</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="hidden md:table-cell">Companies</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow key={problem.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="text-center">{getStatusIcon(problem.status)}</TableCell>
              <TableCell className="text-center">
                {problem.isFavorite ? (
                  <Star className="size-4 mx-auto fill-yellow-500 text-yellow-500" />
                ) : (
                  <StarOff className="size-4 mx-auto text-muted-foreground/30" />
                )}
              </TableCell>
              <TableCell className="font-medium hover:underline decoration-primary underline-offset-4 cursor-pointer">
                <Link href={`/coding/${problem.id}`}>{problem.title}</Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{problem.acceptanceRate.toFixed(1)}%</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("font-medium", getDifficultyColor(problem.difficulty))}>
                  {problem.difficulty}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {problem.companies.slice(0, 2).map(c => (
                    <Badge key={c.name} variant="secondary" className="text-[10px] font-normal">{c.name}</Badge>
                  ))}
                  {problem.companies.length > 2 && (
                    <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground border-dashed">
                      +{problem.companies.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant={problem.status === "Solved" ? "secondary" : "default"}>
                  <Link href={`/coding/${problem.id}`}>
                    {problem.status === "Solved" ? "Practice Again" : "Solve"}
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
