"use client";

import { ProblemTopic } from "@/services/coding/coding.types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProblemTopicTagsProps {
  topics: ProblemTopic[];
  maxDisplay?: number;
}

export function ProblemTopicTags({ topics, maxDisplay = 2 }: ProblemTopicTagsProps) {
  if (!topics || topics.length === 0) return <span className="text-muted-foreground text-xs">-</span>;

  const displayTags = topics.slice(0, maxDisplay);
  const hiddenCount = topics.length - maxDisplay;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {displayTags.map((topic) => (
        <span 
          key={topic} 
          className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md border border-primary/20"
        >
          {topic}
        </span>
      ))}
      
      {hiddenCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[10px] bg-primary/5 text-primary/70 px-1.5 py-0.5 rounded-md border cursor-help">
                +{hiddenCount}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                {topics.slice(maxDisplay).map(t => (
                  <span key={t} className="text-xs">{t}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
