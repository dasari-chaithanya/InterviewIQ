"use client";

import { useRecommendations } from "@/hooks/dashboard/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Brain, Code, Network, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  technical: { icon: Code, color: "text-blue-500", bg: "bg-blue-500/10" },
  system_design: { icon: Network, color: "text-purple-500", bg: "bg-purple-500/10" },
  behavioral: { icon: Brain, color: "text-orange-500", bg: "bg-orange-500/10" },
  general: { icon: Lightbulb, color: "text-green-500", bg: "bg-green-500/10" },
};

export function RecommendationCard() {
  const { data: recommendations, isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <Card className="border-border shadow-sm h-full">
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-semibold">AI Recommendations</CardTitle>
        <CardDescription>Personalized suggestions based on your performance.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec) => {
            const config = typeConfig[rec.type] || typeConfig.general;
            const Icon = config.icon;
            return (
              <div key={rec.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border bg-card">
                <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                  <Icon className={cn("size-6", config.color)} />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                  <Button variant="link" className="p-0 h-auto text-primary text-xs font-semibold mt-1">
                    {rec.actionText} →
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground text-sm py-8 space-y-2">
            <p>Complete interviews to generate initial practice recommendations.</p>
            <p className="text-xs opacity-70">(Deep AI-powered personalized analysis will arrive in Phase 4)</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
