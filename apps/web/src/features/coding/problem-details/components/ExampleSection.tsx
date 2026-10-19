"use client";

import { motion } from "framer-motion";

export function ExampleSection() {
  const examples = [
    {
      id: 1,
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      id: 2,
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: ""
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6 mt-8"
    >
      <h3 className="text-xl font-bold">Examples</h3>
      <div className="space-y-6">
        {examples.map((example, i) => (
          <div key={example.id} className="space-y-2">
            <p className="font-semibold text-sm">Example {example.id}:</p>
            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm border border-border/50 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-lg" />
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-semibold select-none">Input:</span>
                  <span className="text-foreground">{example.input}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-semibold select-none">Output:</span>
                  <span className="text-foreground">{example.output}</span>
                </div>
                {example.explanation && (
                  <div className="flex gap-2 pt-2 mt-2 border-t border-border/50">
                    <span className="text-muted-foreground font-semibold select-none">Explanation:</span>
                    <span className="text-foreground/80 font-sans">{example.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
