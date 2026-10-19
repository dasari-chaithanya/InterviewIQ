"use client";

import React, { useState } from "react";
import { MultiStepProgress } from "@/components/forms/multi-step-progress";
import { StepNavigation } from "@/components/forms/step-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { authService } from "@/services/auth/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { skillsList } from "@/constants/skills";
import { companiesList } from "@/constants/companies";
import { rolesList } from "@/constants/roles";
import { experienceLevels } from "@/constants/experience";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DegreeCombobox } from "@/components/forms/degree-combobox";

const TOTAL_STEPS = 4;

export function OnboardingFlow() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(user?.onboardingStep || 1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    graduationYear: "",
    college: "",
    degree: "",
    targetRole: "",
    experienceLevel: "",
    primaryLanguage: "",
    skills: [] as string[],
    preferredInterviewType: "",
    dailyPracticeGoal: "",
    themePreference: "system",
    notifications: { email: true, push: false },
  });

  const handleNext = async () => {
    if (currentStep === 1 && formData.degree) {
      const trimmed = formData.degree.trim();
      if (/<[^>]*>|javascript:|data:/i.test(trimmed)) {
        toast.error("Please enter a valid degree name without special HTML tags");
        return;
      }
      if (trimmed.length > 100) {
        toast.error("Degree name cannot exceed 100 characters");
        return;
      }
    }

    if (currentStep === TOTAL_STEPS) {
      await handleComplete();
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authService.completeOnboardingStep(formData, currentStep);
      updateUser({ onboardingStep: response.nextStep });
      setCurrentStep(response.nextStep);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to save progress";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await authService.completeOnboardingStep(formData, TOTAL_STEPS);
      updateUser({ hasCompletedOnboarding: true });
      toast.success("Profile setup complete!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to complete onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      }
      return { ...prev, skills: [...prev.skills, skill] };
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-10">
      {/* Phase 6 fix: users can always escape onboarding (e.g. wrong email
          at registration) instead of being trapped by the route guard. */}
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => {
            void (async () => {
              try {
                await logout();
              } catch {
                // Logout already clears local state; ignore navigation errors.
              }
            })();
          }}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Log out
        </button>
      </div>
      <MultiStepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Personal Information"}
            {currentStep === 2 && "Career Goals"}
            {currentStep === 3 && "Skills & Technologies"}
            {currentStep === 4 && "Preferences"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Let's get to know you better."}
            {currentStep === 2 && "What are you aiming for?"}
            {currentStep === 3 && "Select the technologies you are proficient in."}
            {currentStep === 4 && "Customize your InterviewIQ experience."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[300px]">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>College / University</Label>
                  <Input 
                    value={formData.college} 
                    onChange={(e) => setFormData({...formData, college: e.target.value})} 
                    placeholder="e.g. Stanford University"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <DegreeCombobox 
                      value={formData.degree} 
                      onChange={(val) => setFormData({...formData, degree: val})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Graduation Year</Label>
                    <Input 
                      value={formData.graduationYear} 
                      onChange={(e) => setFormData({...formData, graduationYear: e.target.value})} 
                      placeholder="YYYY"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label>Target Role</Label>
                  <Select value={formData.targetRole} onValueChange={(v) => setFormData({...formData, targetRole: v || ""})}>
                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    <SelectContent>
                      {rolesList.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(v) => setFormData({...formData, experienceLevel: v || ""})}>
                    <SelectTrigger><SelectValue placeholder="Select experience" /></SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map(exp => (
                        <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Programming Language</Label>
                  <Input 
                    value={formData.primaryLanguage} 
                    onChange={(e) => setFormData({...formData, primaryLanguage: e.target.value})} 
                    placeholder="e.g. TypeScript, Python"
                  />
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label>Selected Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-2 border rounded-md bg-muted/30">
                    {formData.skills.length === 0 && <span className="text-sm text-muted-foreground p-1">No skills selected</span>}
                    {formData.skills.map(skill => (
                      <Badge key={skill} variant="default" className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                        {skill} ✕
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Available Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.filter(s => !formData.skills.includes(s)).map(skill => (
                      <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => toggleSkill(skill)}>
                        {skill} +
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <Label>Preferred Interview Type</Label>
                  <Select value={formData.preferredInterviewType} onValueChange={(v) => setFormData({...formData, preferredInterviewType: v || ""})}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical / Coding</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="system_design">System Design</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium">Notification Preferences</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-notif" 
                      checked={formData.notifications.email}
                      onCheckedChange={(c) => setFormData({...formData, notifications: {...formData.notifications, email: !!c}})}
                    />
                    <label htmlFor="email-notif" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Receive email updates and practice reminders
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="push-notif" 
                      checked={formData.notifications.push}
                      onCheckedChange={(c) => setFormData({...formData, notifications: {...formData.notifications, push: !!c}})}
                    />
                    <label htmlFor="push-notif" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Receive push notifications
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <StepNavigation 
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === TOTAL_STEPS}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
