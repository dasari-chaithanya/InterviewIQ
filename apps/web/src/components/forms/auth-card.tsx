import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import React from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <BrainCircuit className="size-8 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>

      {footerText && footerLinkText && footerLinkHref && (
        <div className="text-center text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
          >
            {footerLinkText}
          </Link>
        </div>
      )}
    </div>
  );
}
