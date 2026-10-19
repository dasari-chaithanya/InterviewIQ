"use client";

import { InterviewConfiguration } from "@/services/interview/interview.types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ConfigurationSelectorProps {
  value: Partial<InterviewConfiguration>;
  onChange: (value: Partial<InterviewConfiguration>) => void;
}

export function ConfigurationSelector({ value, onChange }: ConfigurationSelectorProps) {
  const update = <K extends keyof InterviewConfiguration>(key: K, val: InterviewConfiguration[K]) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-8">
      
      {/* Core Setup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label>Difficulty Level</Label>
          <Select value={value.difficulty} onValueChange={(v) => update("difficulty", v as InterviewConfiguration["difficulty"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Interview Type</Label>
          <Select value={value.type} onValueChange={(v) => update("type", v as InterviewConfiguration["type"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR">HR / Culture Fit</SelectItem>
              <SelectItem value="Behavioral">Behavioral (STAR)</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Resume">Resume Deep-Dive</SelectItem>
              <SelectItem value="System Design">System Design</SelectItem>
              <SelectItem value="Coding">Coding / DSA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Duration</Label>
          <Select value={value.durationMinutes?.toString()} onValueChange={(v) => update("durationMinutes", parseInt(v || "30"))}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 Minutes</SelectItem>
              <SelectItem value="30">30 Minutes</SelectItem>
              <SelectItem value="45">45 Minutes</SelectItem>
              <SelectItem value="60">60 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Number of Questions</Label>
          <Select value={value.questionCount?.toString()} onValueChange={(v) => update("questionCount", parseInt(v || "5"))}>
            <SelectTrigger>
              <SelectValue placeholder="Select question count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Questions</SelectItem>
              <SelectItem value="10">10 Questions</SelectItem>
              <SelectItem value="15">15 Questions</SelectItem>
              <SelectItem value="20">20 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Question Source</Label>
          <Select value={value.questionSource || "LEGACY"} onValueChange={(v) => update("questionSource", v as InterviewConfiguration["questionSource"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select question source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="QUESTION_BANK">Question Bank (Curated)</SelectItem>
              <SelectItem value="LEGACY">AI Generated (Legacy)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-px bg-border w-full" />

      {/* Advanced Settings */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold">Interaction Mode</h4>
        
        <RadioGroup 
          value={value.voiceMode} 
          onValueChange={(v) => update("voiceMode", v)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Label
            className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col gap-2 hover:bg-muted/50 transition-colors ${value.voiceMode === "Text" ? "border-primary bg-primary/5" : "border-muted bg-transparent"}`}
          >
            <RadioGroupItem value="Text" className="sr-only" />
            <div className="font-semibold">Text Mode</div>
            <div className="text-xs text-muted-foreground font-normal leading-relaxed">
              Read questions and type your answers. Best for quiet environments or quick practice.
            </div>
          </Label>
          <Label
            className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col gap-2 hover:bg-muted/50 transition-colors ${value.voiceMode === "Voice" ? "border-primary bg-primary/5" : "border-muted bg-transparent"}`}
          >
            <RadioGroupItem value="Voice" className="sr-only" />
            <div className="font-semibold">Voice Mode</div>
            <div className="text-xs text-muted-foreground font-normal leading-relaxed">
              Speak your answers with real-time transcription. Simulates a real interview environment.
            </div>
          </Label>
        </RadioGroup>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Card className="shadow-none">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label className="text-base">Follow-up Questions</Label>
                <p className="text-xs text-muted-foreground font-normal">
                  AI will ask dynamic follow-ups based on your answers.
                </p>
              </div>
              <Switch 
                checked={value.allowFollowUps} 
                onCheckedChange={(c) => update("allowFollowUps", c)} 
              />
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-4 flex flex-row items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <Label className="text-base">Coding Workspace</Label>
                <p className="text-xs text-muted-foreground font-normal">
                  Enable integrated code editor for technical questions.
                </p>
              </div>
              <Switch 
                checked={value.codingChallengeEnabled} 
                onCheckedChange={(c) => update("codingChallengeEnabled", c)} 
                disabled={value.type !== "Technical" && value.type !== "Coding"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
