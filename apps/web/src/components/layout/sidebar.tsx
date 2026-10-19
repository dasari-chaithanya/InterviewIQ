"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navigationData, bottomNavigationData } from "@/constants/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-[272px]"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <BrainCircuit className="size-6 text-primary shrink-0" />
          {!isCollapsed && (
            <span className="font-semibold text-lg whitespace-nowrap">InterviewIQ</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      {/* Navigation Links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          {navigationData.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-2 text-xs font-medium text-muted-foreground tracking-wider uppercase mb-1">
                  {group.title}
                </span>
              )}
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link key={item.title} href={item.href}>
                    <span
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "text-sidebar-foreground",
                        isCollapsed ? "justify-center" : ""
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={cn("size-5 shrink-0", isActive ? "text-primary" : "")} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border flex flex-col gap-1">
        {bottomNavigationData.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.title} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground",
                  isCollapsed ? "justify-center" : ""
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn("size-5 shrink-0", isActive ? "text-primary" : "")} />
                {!isCollapsed && <span>{item.title}</span>}
              </span>
            </Link>
          );
        })}
        <button
          className={cn(
            "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 w-full text-left",
            isCollapsed ? "justify-center" : ""
          )}
          title={isCollapsed ? "Log out" : undefined}
        >
          <LogOut className="size-5 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
