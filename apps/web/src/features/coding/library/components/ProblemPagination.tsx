"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProblemPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ProblemPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: ProblemPaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t">
      <div className="text-sm text-muted-foreground flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <span className="shrink-0">
          Showing {totalItems === 0 ? 0 : start} to {end} of {totalItems}
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Rows per page</span>
          <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map(size => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="size-4 mr-1 hidden sm:block" />
          Previous
        </Button>
        <div className="text-sm font-medium px-2 hidden sm:block">
          Page {currentPage} of {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="size-4 ml-1 hidden sm:block" />
        </Button>
      </div>
    </div>
  );
}
