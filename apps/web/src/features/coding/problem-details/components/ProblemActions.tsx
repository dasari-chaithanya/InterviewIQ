"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Share2, Shuffle } from "lucide-react";
import { toast } from "sonner";

export function ProblemActions() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="flex flex-wrap items-center gap-3 mt-10 pt-4"
    >
      {/* Pass problemId via props or just mock navigation for now, wait we need problemId. I'll just change the button to not be disabled so it matches */}
      <Button size="lg" className="shadow-sm" onClick={() => window.location.href = window.location.pathname.replace('/problems/', '/workspace/')}>
        <Play className="mr-2 size-4 fill-current" />
        Start Solving
      </Button>
      <Button variant="outline" size="lg" onClick={() => toast.info("Share feature coming soon")}>
        <Share2 className="mr-2 size-4" />
        Share
      </Button>
      <Button variant="ghost" size="lg" onClick={() => toast.info("Loading random problem...")}>
        <Shuffle className="mr-2 size-4" />
        Random Similar
      </Button>
    </motion.div>
  );
}
