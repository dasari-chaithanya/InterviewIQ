"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function ConstraintSection() {
  const constraints = [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists."
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4 mt-8"
    >
      <h3 className="text-xl font-bold flex items-center gap-2">
        <AlertCircle className="size-5 text-muted-foreground" />
        Constraints
      </h3>
      <ul className="list-disc list-inside space-y-2 text-sm text-foreground/80 marker:text-muted-foreground ml-1">
        {constraints.map((constraint, i) => (
          <li key={i} className="pl-2">
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary/80">
              {constraint}
            </code>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
