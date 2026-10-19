"use client";

import { motion } from "framer-motion";
import { Problem } from "@/services/coding/coding.types";

interface ProblemDescriptionProps {
  problem: Problem;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 mt-6"
    >
      <div className="text-foreground/90 leading-relaxed">
        {/* We are mocking the HTML/Markdown description for now since the type just has a simple string.
            In a real scenario, this might use a markdown renderer. */}
        <p>{problem.description || "Given an array of integers, solve the problem as described in the requirements. Your algorithm should run optimally."}</p>
        
        {/* Mock detailed paragraphs */}
        <p>
          You must implement the solution with the constraints in mind. 
          Return the correct output format without mutating the input parameters unless explicitly asked.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-2">Input Format</h3>
          <p className="text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50 font-mono text-sm">
            An array of integers <code>nums</code> where 1 ≤ nums.length ≤ 10^4
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-foreground mb-2">Output Format</h3>
          <p className="text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50 font-mono text-sm">
            Return a single integer representing the optimal solution.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
