"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, SlidersHorizontal, ArrowDownAZ } from "lucide-react";
import { useState } from "react";

export function HistoryFilters() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 w-full">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          placeholder="Search by problem, language, or ID..." 
          className="pl-9 w-full bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select defaultValue="all">
          <SelectTrigger className="w-[130px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="wrong">Wrong Answer</SelectItem>
            <SelectItem value="tle">Time Limit</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[130px] bg-background">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="newest">
          <SelectTrigger className="w-[140px] bg-background">
            <div className="flex items-center gap-2">
              <ArrowDownAZ className="size-4" />
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="runtime">Fastest Runtime</SelectItem>
            <SelectItem value="memory">Best Memory</SelectItem>
            <SelectItem value="score">Highest Score</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="shrink-0 bg-background">
          <SlidersHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
