"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Cpu, Lightbulb } from "lucide-react";

interface AttemptComparisonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string | null;
}

export function AttemptComparisonModal({ isOpen, onOpenChange, submissionId }: AttemptComparisonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attempt Comparison</DialogTitle>
          <DialogDescription>
            Comparing selected submission vs your best historical attempt.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mt-6">
          
          <div className="p-4 rounded-xl border bg-muted/30 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-semibold text-sm">Attempt A</span>
              <Badge variant="outline" className="text-muted-foreground">Nov 12, 10:43 AM</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Clock className="size-4" /> Runtime</span>
                <span className="font-mono font-medium">85 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Cpu className="size-4" /> Memory</span>
                <span className="font-mono font-medium">42.1 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Lightbulb className="size-4" /> AI Score</span>
                <span className="font-mono font-medium text-orange-500">68/100</span>
              </div>
            </div>
          </div>

          <div className="text-muted-foreground">
            <ArrowRight className="size-6" />
          </div>

          <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-primary/10">
              <span className="font-semibold text-sm text-primary">Attempt B (Selected)</span>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-0">Just Now</Badge>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Clock className="size-4" /> Runtime</span>
                <span className="font-mono font-medium text-green-600">45 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Cpu className="size-4" /> Memory</span>
                <span className="font-mono font-medium text-green-600">38.4 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Lightbulb className="size-4" /> AI Score</span>
                <span className="font-mono font-medium text-green-600">85/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-800">
          <strong className="block mb-1">Improvement Summary</strong>
          Your latest submission demonstrates a significant 47% reduction in runtime by utilizing a hash map instead of nested loops. Memory usage improved slightly. Code readability score increased by 15 points.
        </div>
      </DialogContent>
    </Dialog>
  );
}
