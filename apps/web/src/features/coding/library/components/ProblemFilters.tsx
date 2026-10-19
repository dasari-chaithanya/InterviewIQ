"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export type FilterState = {
  difficulty: string;
  topic: string;
  company: string;
  status: string;
};

interface ProblemFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

export function ProblemFilters({ filters, onFilterChange }: ProblemFiltersProps) {
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const statuses = ["All", "Solved", "Attempted", "Todo"];
  const topics = [
    "All", "Arrays", "Strings", "Hash Table", "Dynamic Programming", 
    "Math", "Sorting", "Tree", "Graph", "Linked List"
  ];
  const companies = ["All", "Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix"];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
        <Filter className="size-4" />
        <span className="hidden sm:inline">Filters</span>
      </div>

      <Select value={filters.difficulty} onValueChange={(v) => onFilterChange("difficulty", v || "")}>
        <SelectTrigger className="w-[120px] h-9 bg-card">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => onFilterChange("status", v || "")}>
        <SelectTrigger className="w-[120px] h-9 bg-card">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map(s => <SelectItem key={s} value={s}>{s === "All" ? "Status" : s}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.topic} onValueChange={(v) => onFilterChange("topic", v || "")}>
        <SelectTrigger className="w-[140px] h-9 bg-card hidden sm:flex">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          {topics.map(t => <SelectItem key={t} value={t}>{t === "All" ? "All Topics" : t}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.company} onValueChange={(v) => onFilterChange("company", v || "")}>
        <SelectTrigger className="w-[140px] h-9 bg-card hidden md:flex">
          <SelectValue placeholder="Company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map(c => <SelectItem key={c} value={c}>{c === "All" ? "All Companies" : c}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
