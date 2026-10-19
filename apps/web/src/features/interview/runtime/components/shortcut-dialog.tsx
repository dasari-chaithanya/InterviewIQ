"use client";

import { useRuntimeStore } from "../store/runtime-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface ShortcutEntry {
  keys: string[];
  description: string;
}

const shortcuts: ShortcutEntry[] = [
  { keys: ["Ctrl", "→"], description: "Next Question" },
  { keys: ["Ctrl", "←"], description: "Previous Question" },
  { keys: ["Ctrl", "Enter"], description: "Save & Next" },
  { keys: ["Ctrl", "M"], description: "Mark for Review" },
  { keys: ["Ctrl", "K"], description: "Open Question Map" },
  { keys: ["Ctrl", "S"], description: "Save Draft" },
  { keys: ["Esc"], description: "Exit Interview" },
  { keys: ["?"], description: "Open Shortcut Help" },
];

export function ShortcutDialog() {
  const { state, dispatch } = useRuntimeStore();

  const close = () => dispatch({ type: "TOGGLE_SHORTCUT_DIALOG" });

  return (
    <Dialog open={state.isShortcutDialogOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-5 text-muted-foreground" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-1">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-2.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md border border-border bg-muted text-xs font-mono font-medium text-muted-foreground shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          On macOS, use ⌘ instead of Ctrl.
        </p>
      </DialogContent>
    </Dialog>
  );
}
