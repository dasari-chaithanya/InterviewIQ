"use client";

import { useState } from "react";
import { Skill } from "@/services/resume/resume-analysis.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Extracted Skills</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search skills..."
              className="w-full sm:w-[200px] pl-8 h-9 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-6">
        {Object.entries(groupedSkills).length > 0 ? (
          Object.entries(groupedSkills).map(([category, catSkills]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {catSkills.sort((a, b) => b.confidence - a.confidence).map((skill) => (
                  <Badge 
                    key={skill.name}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs font-medium flex items-center gap-1.5"
                  >
                    {skill.name}
                    <div className="flex items-center">
                      {/* Simple dot indicator for confidence */}
                      <div className={`size-1.5 rounded-full ${
                        skill.confidence >= 90 ? "bg-green-500" :
                        skill.confidence >= 70 ? "bg-blue-500" :
                        "bg-orange-500"
                      }`} />
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No skills found matching &quot;{searchTerm}&quot;.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
