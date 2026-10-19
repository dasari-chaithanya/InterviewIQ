"use client";

import { CompanyTag } from "@/services/coding/coding.types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProblemCompanyTagsProps {
  companies: CompanyTag[];
  maxDisplay?: number;
}

export function ProblemCompanyTags({ companies, maxDisplay = 2 }: ProblemCompanyTagsProps) {
  if (!companies || companies.length === 0) return <span className="text-muted-foreground text-xs">-</span>;

  const displayTags = companies.slice(0, maxDisplay);
  const hiddenCount = companies.length - maxDisplay;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {displayTags.map((company) => (
        <span 
          key={company.name} 
          className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-md border"
        >
          {company.name}
        </span>
      ))}
      
      {hiddenCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-md border cursor-help">
                +{hiddenCount}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                {companies.slice(maxDisplay).map(c => (
                  <span key={c.name} className="text-xs">{c.name}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
