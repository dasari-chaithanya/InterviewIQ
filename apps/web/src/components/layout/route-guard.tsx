"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const publicRoutes = ["/", "/about", "/contact"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const onboardingRoute = "/onboarding";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublic = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);
    const isOnboardingRoute = pathname.startsWith(onboardingRoute);

    if (!isAuthenticated && !isPublic && !isAuthRoute) {
      // Unauthenticated user trying to access protected route
      router.push("/login");
    } else if (isAuthenticated && isAuthRoute) {
      // Authenticated user trying to access login/register
      router.push("/dashboard");
    } else if (isAuthenticated && !user?.hasCompletedOnboarding && !isOnboardingRoute) {
      // User needs onboarding
      router.push("/onboarding");
    } else if (isAuthenticated && user?.hasCompletedOnboarding && isOnboardingRoute) {
      // User already completed onboarding
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Hide content briefly while redirecting to avoid layout flash
  const isAuthRoute = authRoutes.includes(pathname);
  const isOnboardingRoute = pathname.startsWith(onboardingRoute);
  
  if (!isAuthenticated && !publicRoutes.includes(pathname) && !isAuthRoute) return null;
  if (isAuthenticated && !user?.hasCompletedOnboarding && !isOnboardingRoute) return null;
  if (isAuthenticated && isAuthRoute) return null;

  return <>{children}</>;
}
