"use client";

import { motion } from "framer-motion";
import { Code2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProblemLibraryHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-border">
      <div className="space-y-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Button variant="outline" size="icon" asChild className="h-8 w-8">
            <Link href="/coding">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Code2 className="size-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Problem Library</h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm pl-12"
        >
          Master algorithms and data structures with our curated collection of coding challenges.
        </motion.p>
      </div>
    </div>
  );
}
