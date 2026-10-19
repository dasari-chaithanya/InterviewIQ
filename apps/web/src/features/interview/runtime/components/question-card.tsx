"use client";

import { useRuntimeStore } from "../store/runtime-store";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export function QuestionCard() {
  const { state } = useRuntimeStore();

  if (state.questions.length === 0) return null;

  const question = state.questions[state.currentQuestionIndex];

  return (
    <motion.div 
      key={question.id} // Animate on question change
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            Question {state.currentQuestionIndex + 1} of {state.questions.length}
          </Badge>
          <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
            {question.category}
          </Badge>
          <Badge 
            variant="outline" 
            className={
              question.difficulty === "Beginner" ? "border-green-500 text-green-600" :
              question.difficulty === "Intermediate" ? "border-blue-500 text-blue-600" :
              "border-purple-500 text-purple-600"
            }
          >
            {question.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          <Clock className="size-3.5" /> Est. {question.estimatedMinutes} min
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug tracking-tight text-foreground">
        {question.text}
      </h2>

      <div className="flex flex-wrap gap-2">
        {question.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs bg-muted/50 hover:bg-muted/80 text-muted-foreground flex items-center gap-1">
            <Tag className="size-3" /> {tag}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}

export function AIThinking() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative size-16">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative size-full bg-background border-2 border-primary/20 rounded-full flex items-center justify-center">
          <BrainCircuit className="size-8 text-primary animate-pulse" />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <h3 className="font-medium animate-pulse">AI is thinking...</h3>
        <p className="text-xs text-muted-foreground">Evaluating context and preparing next question.</p>
      </div>
    </div>
  );
}
