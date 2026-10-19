import React from "react";
import { OnboardingFlow } from "@/features/auth/onboarding/onboarding-flow";

export const metadata = {
  title: "Onboarding - InterviewIQ",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <OnboardingFlow />
    </div>
  );
}
