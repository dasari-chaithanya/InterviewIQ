"use client";

import * as React from "react";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileDrawer } from "./mobile-drawer";
import { ThemeSwitcher } from "./theme-switcher";
import { AvatarMenu } from "./avatar-menu";
import { CommandPalette } from "./command-palette";

export function Navbar() {
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
        
        {/* Mobile Drawer Component */}
        <MobileDrawer open={isMobileOpen} onOpenChange={setIsMobileOpen} />

        {/* Future Breadcrumb Placeholder */}
        <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
          Workspace / <span className="text-foreground ml-1">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Trigger */}
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground sm:pr-12 md:w-64"
          onClick={() => setIsCommandOpen(true)}
        >
          <Search className="mr-2 size-4" />
          <span className="hidden sm:inline-flex">Search...</span>
          <span className="inline-flex sm:hidden">Search</span>
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        
        <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />

        {/* Utilities */}
        <ThemeSwitcher />
        <AvatarMenu />
      </div>
    </header>
  );
}
