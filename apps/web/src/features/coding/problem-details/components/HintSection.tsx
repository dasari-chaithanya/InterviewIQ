"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function HintSection() {
  const hints = [
    "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.",
    "So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array keeping so that this search becomes faster?",
    "The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4 mt-8"
    >
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Lightbulb className="size-5 text-yellow-500" />
        Hints
      </h3>
      <Accordion className="w-full">
        {hints.map((hint, i) => (
          <AccordionItem key={i} value={`hint-${i}`}>
            <AccordionTrigger className="text-sm font-medium hover:text-primary transition-colors py-3">
              Hint {i + 1}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
              {hint}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
