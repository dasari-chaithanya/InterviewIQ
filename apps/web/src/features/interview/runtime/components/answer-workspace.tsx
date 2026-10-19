"use client";

import { useEffect, useState, useRef } from "react";
import { useRuntimeStore } from "../store/runtime-store";
import { runtimeService } from "../services/runtime.service";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Code2, RotateCcw, Save } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";
import { VoicePanel } from "../../voice/voice-panel";

export function AnswerWorkspace({ isVoice, isCoding }: { isVoice: boolean, isCoding: boolean }) {
  const { state } = useRuntimeStore();
  if (isCoding) {
    return <CodingPlaceholder />;
  }
  if (isVoice) {
    return <VoicePanel sessionId={state.sessionId} />;
  }
  // Phase 6 fix: key the editor by question so navigation unmounts it.
  // Previously the same instance survived question changes and its stale
  // debounced text was posted to the NEW question's URL (answers recorded
  // under the wrong question). The unmount flush preserves any pending text
  // for the old question before the fresh instance mounts.
  const questionId = state.questions[state.currentQuestionIndex]?.id;
  return <AnswerEditor key={questionId ?? 'no-question'} />;
}

function AnswerEditor() {
  const { state, dispatch } = useRuntimeStore();
  const questionId = state.questions[state.currentQuestionIndex]?.id;
  const answer = state.answers[questionId]?.text || "";
  
  const [localText, setLocalText] = useState(answer);
  const debouncedText = useDebounce(localText, 1000);

  const localTextRef = useRef(localText);
  localTextRef.current = localText;
  const questionIdRef = useRef(questionId);
  questionIdRef.current = questionId;
  // Phase 6 fix: the 1s TICK_TIMER rebuilds state.answers identity every
  // tick. Depending on it re-ran this effect (and its POST) every second.
  // Read answers through a ref so saves fire only on real text changes.
  const answersRef = useRef(state.answers);
  answersRef.current = state.answers;

  // Flush unsaved draft before question changes or component unmounts
  useEffect(() => {
    return () => {
      const qId = questionIdRef.current;
      const text = localTextRef.current;
      if (qId && text !== undefined) {
        const stored = state.answers[qId]?.text || "";
        if (text !== stored) {
          dispatch({ type: "UPDATE_ANSWER", payload: { questionId: qId, text } });
          runtimeService.saveDraft(state.sessionId, qId, text).catch(console.error);
        }
      }
    };
  }, [questionId, state.sessionId, state.answers, dispatch]);

  // Sync local state when question changes
  useEffect(() => {
    setLocalText(state.answers[questionId]?.text || "");
  }, [questionId]); // Deliberately omit state.answers so we don't overwrite user typing on timer ticks

  // Handle autosave. Reads the store through a ref: the 1s TICK_TIMER
  // rebuilds state.answers identity every tick, and depending on it would
  // re-fire this effect (and its POST) every second (Phase 6 fix).
  useEffect(() => {
    if (!questionId) return;

    // Only save if the text actually differs from what is in the store,
    // and avoid saving empty text on initial render if it was empty.
    const currentStoredText = answersRef.current[questionId]?.text || "";

    if (debouncedText !== currentStoredText) {
      dispatch({ type: "UPDATE_ANSWER", payload: { questionId, text: debouncedText } });

      // Trigger backend save
      runtimeService.saveDraft(state.sessionId, questionId, debouncedText).then(() => {
        dispatch({ type: "SET_AUTOSAVE", payload: new Date().toISOString() });
      }).catch(console.error);
    }
  }, [debouncedText, questionId, state.sessionId, dispatch]);

  const wordCount = localText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const estimatedSpeakingTime = Math.ceil(wordCount / 130); // ~130 words per minute

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Your Answer</span>
        <div className="flex gap-4">
          <span>{wordCount} words</span>
          <span>~{estimatedSpeakingTime} min speaking</span>
        </div>
      </div>

      <Textarea
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        placeholder="Type your answer here. Use the STAR method (Situation, Task, Action, Result)..."
        className="flex-1 min-h-[300px] text-base leading-relaxed resize-none p-6 bg-card border-border shadow-inner"
      />

      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setLocalText("")}
          className="text-muted-foreground hover:text-destructive"
        >
          <RotateCcw className="size-4 mr-2" /> Clear
        </Button>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {state.lastAutoSaveAt && <><Save className="size-3" /> Draft saved</>}
        </span>
      </div>

      {/* Structured Self-Reflection Foundation */}
      <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Self-Reflection & Readiness Tag</span>
          {state.answers[questionId]?.reflection?.reflectionType && (
            <span className="text-[11px] text-primary font-medium">Tagged</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "DID_NOT_KNOW" as const, label: "Didn't know concept" },
            { id: "COULD_NOT_EXPLAIN" as const, label: "Knew it, couldn't explain" },
            { id: "NEED_MORE_PRACTICE" as const, label: "Need more practice" },
            { id: "RECALL_UNDER_PRESSURE" as const, label: "Recall under pressure" },
            { id: "OTHER" as const, label: "Other" },
          ].map((tag) => {
            const isSelected = state.answers[questionId]?.reflection?.reflectionType === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  const newType = isSelected ? undefined : tag.id;
                  const newRef = {
                    ...state.answers[questionId]?.reflection,
                    reflectionType: newType,
                  };
                  dispatch({ type: "SET_REFLECTION", payload: { questionId, reflection: newRef } });
                  runtimeService.saveReflection(state.sessionId, questionId, newRef).catch(console.error);
                }}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                    : "bg-background/80 hover:bg-muted text-muted-foreground border-border/80"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
        {state.answers[questionId]?.reflection?.reflectionType && (
          <input
            type="text"
            placeholder="Optional quick reflection note..."
            value={state.answers[questionId]?.reflection?.note || ""}
            onChange={(e) => {
              const newRef = {
                ...state.answers[questionId]?.reflection,
                note: e.target.value,
              };
              dispatch({ type: "SET_REFLECTION", payload: { questionId, reflection: newRef } });
              runtimeService.saveReflection(state.sessionId, questionId, newRef).catch(console.error);
            }}
            className="w-full text-xs px-3 py-1.5 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        )}
      </div>
    </div>
  );
}

function CodingPlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border bg-muted/10 rounded-xl p-8 text-center space-y-4 min-h-[400px]">
      <div className="p-4 rounded-full bg-blue-500/10">
        <Code2 className="size-8 text-blue-500" />
      </div>
      <h3 className="font-semibold text-lg">Integrated Coding Environment</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Epic 6 Placeholder: In the next major release, this area will feature a full Monaco editor connected to Judge0 for real-time code execution and algorithmic evaluation.
      </p>
      <Button variant="outline" disabled>Editor Coming Soon</Button>
    </div>
  );
}

