"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateSession } from "@/hooks/interview/use-interview";
import { InterviewConfiguration } from "@/services/interview/interview.types";
import { interviewService } from "@/services/interview/interview.service";
import { runtimeService } from "@/features/interview/runtime/services/runtime.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, Rocket, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { ResumeSelector } from "./resume-selector";
import { RoleSelector, CompanySelector } from "./role-company-selector";
import { ConfigurationSelector } from "./configuration-selector";
import { GenerationProgress } from "./generation-progress";
import { ScheduleDialog } from "./schedule-dialog";

const steps = [
  { id: "resume", title: "Select Resume", description: "Choose a base profile for the AI." },
  { id: "role", title: "Target Role", description: "What position are you interviewing for?" },
  { id: "company", title: "Target Company", description: "Who are you interviewing with?" },
  { id: "config", title: "Configuration", description: "Tweak the interview parameters." },
  { id: "summary", title: "Review & Start", description: "Verify your setup." },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export function InterviewWizard() {
  const router = useRouter();
  const { mutate: createSession, isPending: isGenerating } = useCreateSession();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimatingGeneration, setIsAnimatingGeneration] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [config, setConfig] = useState<Partial<InterviewConfiguration>>({
    difficulty: "Intermediate",
    type: "Technical",
    durationMinutes: 30,
    questionCount: 5,
    voiceMode: "Text",
    allowFollowUps: true,
    codingChallengeEnabled: false,
    questionSource: "LEGACY",
  });

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setDirection(1);
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    } else {
      router.push("/interview");
    }
  };

  const onGenerationAnimationComplete = useCallback(() => {
    // No-op: session creation starts immediately in handleGenerate so the
    // animation never gates real work (Phase 6: no fake progress).
  }, []);

  const handleGenerate = () => {
    if (isAnimatingGeneration || isGenerating) return;
    setIsAnimatingGeneration(true);
    createSession(config as InterviewConfiguration, {
      onError: () => {
        setIsAnimatingGeneration(false);
      },
    });
  };

  /**
   * Phase 5 scheduling: create the session, ensure questions are selected
   * (READY), then schedule — without ever entering the runtime workspace,
   * so instant-start behavior is untouched.
   */
  const handleScheduleConfirm = async (input: { scheduledAtLocal: string; timeZone: string }) => {
    const session = await interviewService.createSession(config as InterviewConfiguration);
    await runtimeService.generateQuestions(session.id, config as InterviewConfiguration);
    await interviewService.scheduleSession(session.id, input);
    toast.success("Interview scheduled.");
    router.push("/interview");
  };

  if (isAnimatingGeneration || isGenerating) {
    return (
      <Card className="border-border shadow-sm max-w-2xl mx-auto mt-12">
        <CardContent className="p-0">
          <GenerationProgress onComplete={onGenerationAnimationComplete} />
        </CardContent>
      </Card>
    );
  }

  const isStepValid = () => {
    switch (currentStepIndex) {
      case 0: return true; // Resume is optional
      case 1: return !!config.role && config.role.length > 2;
      case 2: return !!config.company && config.company.length > 2;
      case 3: return true;
      default: return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      
      {/* Wizard Header & Progress */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={prevStep}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{steps[currentStepIndex].title}</h1>
            <p className="text-muted-foreground text-sm">{steps[currentStepIndex].description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ease-out ${index <= currentStepIndex ? "bg-primary" : "bg-transparent"}`}
                style={{ width: index < currentStepIndex ? "100%" : index === currentStepIndex ? "50%" : "0%" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm min-h-[400px]">
        <CardContent className="p-6 sm:p-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStepIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full h-full"
            >
              {currentStepIndex === 0 && (
                <ResumeSelector 
                  value={config.resumeId} 
                  onChange={(id) => setConfig({ ...config, resumeId: id })} 
                />
              )}
              {currentStepIndex === 1 && (
                <RoleSelector 
                  value={config.role || ""} 
                  onChange={(role) => setConfig({ ...config, role })} 
                />
              )}
              {currentStepIndex === 2 && (
                <CompanySelector 
                  value={config.company || ""} 
                  onChange={(company) => setConfig({ ...config, company })} 
                />
              )}
              {currentStepIndex === 3 && (
                <ConfigurationSelector 
                  value={config} 
                  onChange={(updates) => setConfig({ ...config, ...updates })} 
                />
              )}
              {currentStepIndex === 4 && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-muted/30 border border-border space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Target Role</p>
                        <p className="font-semibold">{config.role}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Target Company</p>
                        <p className="font-semibold">{config.company}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Interview Type</p>
                        <p className="font-semibold">{config.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Difficulty</p>
                        <p className="font-semibold">{config.difficulty}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Duration &amp; Q&apos;s</p>
                        <p className="font-semibold">{config.durationMinutes} min ({config.questionCount} Questions)</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Voice Mode</p>
                        <p className="font-semibold">{config.voiceMode}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex gap-3">
                    <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Ready to generate</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Our AI will now dynamically create a personalized interview session based on your selected criteria and resume background.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="ghost" onClick={prevStep}>
          {currentStepIndex === 0 ? "Cancel" : "Back"}
        </Button>
        {currentStepIndex < steps.length - 1 ? (
          <Button onClick={nextStep} disabled={!isStepValid()} className="gap-2">
            Continue <ArrowRight className="size-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setScheduleOpen(true)}
              disabled={isAnimatingGeneration || isGenerating || !config.role || !config.company}
              className="gap-2"
            >
              <CalendarClock className="size-4" /> Schedule for Later
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isAnimatingGeneration || isGenerating || !config.role || !config.company}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Rocket className="size-4" /> Generate Interview
            </Button>
          </div>
        )}
      </div>

      <ScheduleDialog open={scheduleOpen} onOpenChange={setScheduleOpen} mode="Schedule" onConfirm={handleScheduleConfirm} />

    </div>
  );
}
