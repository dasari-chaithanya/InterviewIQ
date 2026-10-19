export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  isActive: boolean;
  isVerified: boolean;
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  onboardingData?: OnboardingData | null;
}

export interface Session {
  user: User;
  token: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface OnboardingData {
  // Step 1
  graduationYear?: string;
  college?: string;
  degree?: string;
  // Step 2
  targetRole?: string;
  experienceLevel?: string;
  preferredCompanies?: string[];
  primaryLanguage?: string;
  // Step 3
  skills?: string[];
  // Step 4
  preferredInterviewType?: string;
  dailyPracticeGoal?: string;
  difficultyLevel?: string;
  themePreference?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
  };
}
