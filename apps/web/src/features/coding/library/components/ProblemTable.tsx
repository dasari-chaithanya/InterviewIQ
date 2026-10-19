"use client";

import { motion } from "framer-motion";
import { Problem } from "@/services/coding/coding.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProblemStatusBadge } from "./ProblemStatusBadge";
import { ProblemDifficultyBadge } from "./ProblemDifficultyBadge";
import { ProblemTopicTags } from "./ProblemTopicTags";
import { ProblemCompanyTags } from "./ProblemCompanyTags";
import { FavoriteButton } from "./FavoriteButton";

interface ProblemTableProps {
  problems: Problem[];
}

export function ProblemTable({ problems }: ProblemTableProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="rounded-md border bg-card overflow-hidden hidden md:block">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[50px] text-center">Status</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="w-[100px]">Difficulty</TableHead>
            <TableHead className="w-[100px] text-right">Acceptance</TableHead>
            <TableHead className="min-w-[150px]">Topics</TableHead>
            <TableHead className="min-w-[150px]">Companies</TableHead>
            <TableHead className="w-[50px] text-center"></TableHead>
            <TableHead className="w-[100px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, i) => (
            <TableRow key={problem.id} className="group hover:bg-muted/30">
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <ProblemStatusBadge status={problem.status} />
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <Link 
                  href={`/coding/problems/${problem.id}`}
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {problem.title}
                </Link>
              </TableCell>
              <TableCell>
                <ProblemDifficultyBadge difficulty={problem.difficulty} />
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-xs">
                {problem.acceptanceRate.toFixed(1)}%
              </TableCell>
              <TableCell>
                <ProblemTopicTags topics={problem.topics} maxDisplay={2} />
              </TableCell>
              <TableCell>
                <ProblemCompanyTags companies={problem.companies} maxDisplay={2} />
              </TableCell>
              <TableCell className="text-center">
                <FavoriteButton isFavorite={problem.isFavorite} problemId={problem.id} />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/coding/problems/${problem.id}`}>
                    <Play className="size-4" />
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
