"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Shuffle, BarChart3, Clock, Code2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function CodingQuickActions() {
  const actions = [
    {
      title: "Random Challenge",
      icon: Shuffle,
      onClick: () => toast.success("Loading random challenge..."),
      variant: "outline" as const,
    },
    {
      title: "Resume Session",
      icon: Clock,
      onClick: () => toast.error("No active session to resume"),
      variant: "outline" as const,
    },
    {
      title: "Mock Interview Round",
      icon: Code2,
      onClick: () => toast.info("Coming soon in Epic 9"),
      variant: "secondary" as const,
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button asChild size="lg" className="h-auto py-4 flex flex-col gap-2">
        <Link href="/coding/problems">
          <Play className="size-5" />
          <span>Browse Problems</span>
        </Link>
      </Button>

      {actions.map((action, i) => (
        <Button 
          key={i} 
          variant={action.variant} 
          size="lg" 
          className="h-auto py-4 flex flex-col gap-2 bg-card hover:bg-muted/50"
          onClick={action.onClick}
        >
          <action.icon className="size-5 text-muted-foreground" />
          <span className="text-muted-foreground">{action.title}</span>
        </Button>
      ))}
    </div>
  );
}
