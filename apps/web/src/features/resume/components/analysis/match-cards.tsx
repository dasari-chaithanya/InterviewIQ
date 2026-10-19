"use client";

import { RoleMatch, CompanyMatch } from "@/services/resume/resume-analysis.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Building2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MatchCards({ roles, companies }: { roles: RoleMatch[], companies: CompanyMatch[] }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* Role Match */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="size-5 text-primary" /> Role Matches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {roles.map((role, i) => (
            <div key={i} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-semibold">{role.role}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{role.matchPercentage}%</span>
                </div>
              </div>
              <Progress value={role.matchPercentage} className="h-2" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="size-3.5 text-orange-500" /> Missing Skills
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {role.missingSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-blue-500" /> Recommended
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {role.recommendedLearning.map(learn => (
                      <Badge key={learn} variant="secondary">
                        {learn}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Company Match */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="size-5 text-primary" /> Target Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {companies.map((company, i) => (
            <div key={i} className="p-6 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-semibold">{company.company}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{company.matchScore}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
              <Progress value={company.matchScore} className="h-2" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-green-500" /> Strengths
                  </h5>
                  <ul className="pl-4 list-disc marker:text-green-500 text-muted-foreground space-y-0.5">
                    {company.strengths.map(s => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-muted-foreground flex items-center gap-1">
                    <AlertTriangle className="size-3.5 text-red-500" /> Weak Areas
                  </h5>
                  <ul className="pl-4 list-disc marker:text-red-500 text-muted-foreground space-y-0.5">
                    {company.weakAreas.map(w => <li key={w}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
    </div>
  );
}
