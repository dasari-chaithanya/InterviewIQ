"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  problemId: string;
  className?: string;
  withText?: boolean;
}

export function BookmarkButton({ isBookmarked: initialBookmarked, problemId, className, withText = false }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    if (!isBookmarked) {
      toast.success("Saved to bookmarks");
    } else {
      toast.info("Removed from bookmarks");
    }
  };

  return (
    <Button
      variant="outline"
      size={withText ? "default" : "icon"}
      className={cn(
        "transition-colors",
        isBookmarked ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={toggleBookmark}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark className={cn(withText ? "size-4 mr-2" : "size-4", isBookmarked && "fill-current")} />
      {withText && (isBookmarked ? "Saved" : "Save")}
    </Button>
  );
}
