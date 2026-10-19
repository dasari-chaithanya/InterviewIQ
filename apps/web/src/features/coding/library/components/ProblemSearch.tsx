"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce"; // We'll need to create this if it doesn't exist, but typically standard

interface ProblemSearchProps {
  onSearch: (query: string) => void;
}

export function ProblemSearch({ onSearch }: ProblemSearchProps) {
  const [query, setQuery] = useState("");
  // Simple inline debounce since we don't have a guaranteed hook
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full sm:max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input 
        placeholder="Search problems, topics, or companies..." 
        className="pl-9 bg-card"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
