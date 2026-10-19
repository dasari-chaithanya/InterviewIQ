"use client";

import * as React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout
 * 
 * Provides the core layout shell for all authenticated pages.
 * Supports a fixed sidebar, a sticky navbar, and a responsive main content area.
 * Follows the DESIGN_SYSTEM.md specifications for dimensions and breakpoints.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar Placeholder Area
          Desktop: 272px wide (expanded) or 72px (collapsed).
          Mobile: Hidden (controlled by md:block).
          Future: Will contain actual Sidebar component with collapse logic.
      */}
      <aside className="hidden md:flex flex-col w-[272px] shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300">
        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground border-dashed border-2 border-border m-4 rounded-xl">
          Sidebar Placeholder
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar Placeholder Area
            Height: 64px (h-16). Sticky at the top.
            Future: Will contain Breadcrumb, Search, Notifications, Theme, Avatar, Mobile Menu Trigger.
        */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-full w-full items-center justify-center px-4 text-sm text-muted-foreground border-dashed border-2 border-border mx-4 my-2 rounded-lg">
            Navbar Placeholder
          </div>
        </header>

        {/* Responsive Content Container
            Fills remaining height, scrolls independently if needed.
            Padding matches Design System: 16px mobile, 24px desktop.
            Max width 1440px.
        */}
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1440px] p-4 md:p-6 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
