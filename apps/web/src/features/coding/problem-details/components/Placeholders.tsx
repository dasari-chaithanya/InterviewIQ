"use client";

import { MessageSquare, FileText } from "lucide-react";

export function DiscussionPlaceholder() {
  return (
    <div className="py-12 px-6 text-center border border-dashed rounded-xl bg-muted/10 mt-8">
      <MessageSquare className="size-10 text-muted-foreground/50 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Community Discussions</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        Community discussions and solutions will be available in a future release. Solve the problem first to see how others approached it!
      </p>
    </div>
  );
}

export function EditorialPlaceholder() {
  return (
    <div className="py-12 px-6 text-center border border-dashed rounded-xl bg-muted/10 mt-8">
      <FileText className="size-10 text-muted-foreground/50 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Official Editorial</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        The official editorial and deep-dive explanations will be unlocked automatically after you solve this problem.
      </p>
    </div>
  );
}
