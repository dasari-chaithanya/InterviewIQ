"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { handleApiError } from "@/lib/api/api.errors";
import { useRouter } from "next/navigation";
import { OnboardingData } from "@/types/auth";

export function useLoginMutation() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: Record<string, string>) => 
      authService.login(email, password),
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success("Successfully logged in");
      if (data.user.hasCompletedOnboarding) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to login. Please try again.");
    },
  });
}

export function useRegisterMutation() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ name, email, password }: Record<string, string>) => 
      authService.register(name, email, password),
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success("Account created successfully!");
      router.push("/onboarding");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to create account.");
    },
  });
}

export function useGoogleLoginMutation() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (idToken: string) => authService.googleLogin(idToken),
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success("Successfully logged in");
      router.push(data.user.hasCompletedOnboarding ? "/dashboard" : "/onboarding");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Google sign-in failed. Please try again.");
    },
  });
}

export function useOnboardingMutation() {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: ({ data, step }: { data: Partial<OnboardingData>; step: number }) => 
      authService.completeOnboardingStep(data, step),
    onSuccess: (response, variables) => {
      if (variables.step >= 4) {
        updateUser({ hasCompletedOnboarding: true });
        toast.success("Profile setup complete!");
      } else {
        updateUser({ onboardingStep: response.nextStep });
      }
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to save progress");
    },
  });
}
