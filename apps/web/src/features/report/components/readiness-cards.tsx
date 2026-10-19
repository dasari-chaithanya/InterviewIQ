"use client";

import { CompanyReadiness, RoleReadiness } from "@/services/report/report.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, UserCircle, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadinessCardsProps {
  companies?: CompanyReadiness[];
  roles?: RoleReadiness[];
  isLoading: boolean;
}

export function ReadinessCards({ companies, roles, isLoading }: ReadinessCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Company Readiness */}
      {companies && companies.length > 0 && (
        <Card className="border-border shadow-sm flex flex-col">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="size-5 text-primary" /> Target Companies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 divide-y divide-border">
            {companies.map((company) => (
              <div key={company.company} className="p-5 hover:bg-muted/30 transition-colors space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center border">
                      <Building2 className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">{company.company}</h4>
                      <Badge variant={company.estimatedSuccess === "High" ? "default" : company.estimatedSuccess === "Medium" ? "secondary" : "outline"} className={cn("mt-1 text-[10px]", company.estimatedSuccess === "High" && "bg-green-600 hover:bg-green-600")}>
                        {company.estimatedSuccess} Success Prob.
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-2xl font-bold">{company.readinessPercentage}%</span>
                    <Progress value={company.readinessPercentage} className="h-1.5 w-24" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-green-500" /> Strong Matches
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {company.strongSkills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-[10px] bg-green-500/5 text-green-700 border-green-500/20">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="size-3 text-orange-500" /> Missing/Weak
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {company.weakSkills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-[10px] bg-orange-500/5 text-orange-700 border-orange-500/20">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Role Readiness */}
      {roles && roles.length > 0 && (
        <Card className="border-border shadow-sm flex flex-col">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <UserCircle className="size-5 text-primary" /> Role Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 divide-y divide-border">
            {roles.map((role) => (
              <div key={role.role} className="p-5 hover:bg-muted/30 transition-colors space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <UserCircle className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">{role.role}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Role Match</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-2xl font-bold">{role.matchPercentage}%</span>
                    <Progress value={role.matchPercentage} className="h-1.5 w-24" />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-semibold text-muted-foreground">Missing Requirements</h5>
                    <div className="flex flex-wrap gap-1">
                      {role.missingSkills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-[10px]">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Lightbulb className="size-3 text-primary" /> Learning Suggestions
                    </h5>
                    <ul className="space-y-1">
                      {role.learningSuggestions.map((suggestion, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="shrink-0 size-1 rounded-full bg-primary mt-1.5" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
