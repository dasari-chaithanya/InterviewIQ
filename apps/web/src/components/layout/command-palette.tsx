"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>Search for commands and actions</DialogDescription>
        </VisuallyHidden>
        <div className="p-4 text-center text-sm text-muted-foreground">
          Command Palette is under construction.
        </div>
      </DialogContent>
    </Dialog>
  );
}
