import { apiClient } from "@/lib/api/api.client";
import { setAccessToken } from "@/lib/api/token.store";
import { LoginResponse, RegisterResponse, User, OnboardingData } from "@/types/auth";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/login", { email, password });
    const data = response.data.data;
    
    // Store the access token in memory
    setAccessToken(data.accessToken);

    return {
      token: data.accessToken,
      user: data.user,
    };
  },

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const response = await apiClient.post("/auth/google", { idToken });
    const data = response.data.data;
    setAccessToken(data.accessToken);
    return { token: data.accessToken, user: data.user };
  },

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
    const response = await apiClient.post("/auth/register", { firstName, lastName, email, password });
    const data = response.data.data;
    
    setAccessToken(data.accessToken);

    return {
      token: data.accessToken,
      user: data.user,
    };
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
    setAccessToken(null);
  },

  async completeOnboardingStep(data: Partial<OnboardingData>, step: number): Promise<{ success: boolean; nextStep: number }> {
    // Replace with real user update endpoint, e.g., PATCH /users/me/onboarding
    const response = await apiClient.patch("/auth/onboarding", {
      onboardingData: data,
      onboardingStep: Math.min(step + 1, 4),
      hasCompletedOnboarding: step >= 4,
    });
    
    const user = response.data.data.user;
    return {
      success: true,
      nextStep: user.onboardingStep || step + 1,
    };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    return response.data.data.user;
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, newPassword });
  },
};
