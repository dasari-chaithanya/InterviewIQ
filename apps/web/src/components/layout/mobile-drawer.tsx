"use client";

import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function MobileDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left">
        <VisuallyHidden>
          <SheetTitle>Mobile Navigation Menu</SheetTitle>
          <SheetDescription>Navigation links for mobile devices</SheetDescription>
        </VisuallyHidden>
        <div className="p-4 text-center text-sm text-muted-foreground">
          Mobile navigation is under construction.
        </div>
      </SheetContent>
    </Sheet>
  );
}
