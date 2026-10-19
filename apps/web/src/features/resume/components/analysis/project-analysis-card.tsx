"use client";

import { Project } from "@/services/resume/resume-analysis.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FolderGit2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectAnalysisProps {
  projects: Project[];
}

export function ProjectAnalysisCard({ projects }: ProjectAnalysisProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FolderGit2 className="size-5 text-primary" />
          Project Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="divide-y divide-border">
          {projects.map((project) => (
            <div key={project.id} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-base">{project.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    project.complexity === "High" ? "border-purple-500 text-purple-600 bg-purple-500/10" :
                    project.complexity === "Medium" ? "border-blue-500 text-blue-600 bg-blue-500/10" :
                    "border-green-500 text-green-600 bg-green-500/10"
                  }
                >
                  {project.complexity}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2 bg-green-500/5 p-3 rounded-lg border border-green-500/20">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-green-600 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" /> Strengths
                  </h5>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-5 list-disc marker:text-green-500">
                    {project.strengths.map((str, i) => <li key={i}>{str}</li>)}
                  </ul>
                </div>
                
                <div className="space-y-2 bg-orange-500/5 p-3 rounded-lg border border-orange-500/20">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    <AlertCircle className="size-3.5" /> Weaknesses
                  </h5>
                  <ul className="text-sm space-y-1 text-muted-foreground pl-5 list-disc marker:text-orange-500">
                    {project.weaknesses.map((wk, i) => <li key={i}>{wk}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
