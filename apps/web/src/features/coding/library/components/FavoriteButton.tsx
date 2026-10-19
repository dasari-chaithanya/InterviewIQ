"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteButtonProps {
  isFavorite: boolean;
  problemId: string;
}

export function FavoriteButton({ isFavorite: initialFavorite, problemId }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(initialFavorite);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
    
    // In a real app, you'd fire a mutation here
    if (!isFav) {
      toast.success("Added to favorites");
    } else {
      toast.info("Removed from favorites");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-8 hover:bg-muted transition-colors",
        isFav ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground"
      )}
      onClick={toggleFavorite}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Bookmark className={cn("size-4", isFav && "fill-current")} />
    </Button>
  );
}
