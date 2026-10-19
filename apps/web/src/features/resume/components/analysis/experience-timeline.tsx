"use client";

import { Experience, Education } from "@/services/resume/resume-analysis.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineProps {
  experience: Experience[];
  education: Education[];
}

export function ExperienceTimeline({ experience, education }: TimelineProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg font-semibold">Experience & Education</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Experience Section */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-6 uppercase tracking-wider text-muted-foreground">
              <Briefcase className="size-4" /> Work History
            </h3>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={exp.id} className="relative pl-6">
                  {/* Timeline connecting line */}
                  {index !== experience.length - 1 && (
                    <div className="absolute left-[9px] top-7 bottom-[-24px] w-px bg-border" />
                  )}
                  {/* Timeline node */}
                  <div className="absolute left-0 top-1.5 size-[19px] rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                    <div>
                      <h4 className="font-semibold text-base">{exp.role}</h4>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <Building2 className="size-3.5" />
                        {exp.company}
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md shrink-0 self-start sm:self-auto">
                      {exp.duration}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.technologies.map(tech => (
                      <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border w-full" />

          {/* Education Section */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-6 uppercase tracking-wider text-muted-foreground">
              <GraduationCap className="size-4" /> Education
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={`${edu.degree}-${index}`} className="relative pl-6">
                  {index !== education.length - 1 && (
                    <div className="absolute left-[9px] top-7 bottom-[-24px] w-px bg-border" />
                  )}
                  <div className="absolute left-0 top-1.5 size-[19px] rounded-full bg-background border-2 border-muted-foreground flex items-center justify-center">
                    <div className="size-2 rounded-full bg-muted-foreground" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                    <div>
                      <h4 className="font-semibold text-base">{edu.degree}</h4>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {edu.university}
                      </div>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md shrink-0 self-start sm:self-auto">
                      Class of {edu.graduationYear}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
