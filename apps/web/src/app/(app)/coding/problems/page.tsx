"use client";

import { useState, useMemo } from "react";
import { useProblems } from "@/services/coding/use-coding";
import { ProblemLibraryHeader } from "@/features/coding/library/components/ProblemLibraryHeader";
import { ProblemSearch } from "@/features/coding/library/components/ProblemSearch";
import { ProblemFilters, FilterState } from "@/features/coding/library/components/ProblemFilters";
import { ProblemSort } from "@/features/coding/library/components/ProblemSort";
import { ProblemPagination } from "@/features/coding/library/components/ProblemPagination";
import { ProblemTable } from "@/features/coding/library/components/ProblemTable";
import { ProblemCard } from "@/features/coding/library/components/ProblemCard";
import { LibrarySkeleton, LibraryEmptyState, LibraryErrorState } from "@/features/coding/library/components/LibrarySkeleton";
import { Problem, ProblemTopic } from "@/services/coding/coding.types";

export default function ProblemLibraryPage() {
  const { data: problems, isLoading, error, refetch } = useProblems();

  // Filter States
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    difficulty: "All",
    topic: "All",
    company: "All",
    status: "All"
  });
  const [sortBy, setSortBy] = useState("newest");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    setCurrentPage(1);
  };

  // Derived state (Filter, Sort, Paginate)
  const processedProblems = useMemo(() => {
    if (!problems) return [];
    
    let result = [...problems];

    // 1. Search
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.topics.some(t => t.toLowerCase().includes(q)) ||
        p.companies.some(c => c.name.toLowerCase().includes(q))
      );
    }

    // 2. Filters
    if (filters.difficulty !== "All") {
      result = result.filter(p => p.difficulty === filters.difficulty);
    }
    if (filters.status !== "All") {
      if (filters.status === "Bookmarked") {
        result = result.filter(p => p.isFavorite);
      } else {
        result = result.filter(p => p.status === filters.status);
      }
    }
    if (filters.topic !== "All") {
      result = result.filter(p => p.topics.includes(filters.topic as unknown as ProblemTopic));
    }
    if (filters.company !== "All") {
      result = result.filter(p => p.companies.some(c => c.name === filters.company));
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.acceptanceRate - a.acceptanceRate; // Mocking popularity by acceptance rate for now
        case "acceptance":
          return b.acceptanceRate - a.acceptanceRate;
        case "difficulty":
          const weight = { Easy: 1, Medium: 2, Hard: 3 };
          return weight[a.difficulty] - weight[b.difficulty];
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return 0; // Assuming initial array is "newest"
      }
    });

    return result;
  }, [problems, query, filters, sortBy]);

  const totalPages = Math.ceil(processedProblems.length / pageSize);
  const paginatedProblems = processedProblems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 pb-16">
      <ProblemLibraryHeader />

      {isLoading ? (
        <LibrarySkeleton />
      ) : error ? (
        <LibraryErrorState onRetry={() => refetch()} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-6">
            <ProblemSearch onSearch={handleSearch} />
            <div className="flex flex-wrap items-center gap-4">
              <ProblemFilters filters={filters} onFilterChange={handleFilterChange} />
              <ProblemSort sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {processedProblems.length === 0 ? (
            <LibraryEmptyState 
              message={query ? `No problems found for "${query}".` : undefined}
            />
          ) : (
            <div className="space-y-4">
              <ProblemTable problems={paginatedProblems} />
              
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedProblems.map((p, i) => (
                  <ProblemCard key={p.id} problem={p} index={i} />
                ))}
              </div>

              <ProblemPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={processedProblems.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
