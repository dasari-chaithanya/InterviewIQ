"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface ProblemSortProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function ProblemSort({ sortBy, onSortChange }: ProblemSortProps) {
  const options = [
    { label: "Newest", value: "newest" },
    { label: "Most Popular", value: "popular" },
    { label: "Acceptance Rate", value: "acceptance" },
    { label: "Difficulty", value: "difficulty" },
    { label: "Alphabetical", value: "alphabetical" },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="size-4 text-muted-foreground hidden sm:block" />
      <Select value={sortBy} onValueChange={(v) => onSortChange(v || "")}>
        <SelectTrigger className="w-[140px] h-9 bg-card">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
