import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-muted/30 -z-10" />
      {children}
    </div>
  );
}
