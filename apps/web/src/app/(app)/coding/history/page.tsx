"use client";

import { useState } from "react";
import { HistoryHeader } from "@/features/coding/history/components/HistoryHeader";
import { HistoryFilters } from "@/features/coding/history/components/HistoryFilters";
import { AttemptTable } from "@/features/coding/history/components/AttemptTable";
import { AttemptComparisonModal } from "@/features/coding/history/components/AttemptComparisonModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CodingHistoryPage() {
  const [compareId, setCompareId] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <HistoryHeader />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <HistoryFilters />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <AttemptTable onCompare={(id) => setCompareId(id)} />
        
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1</strong> to <strong>15</strong> of <strong>15</strong> attempts
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-muted">1</Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <AttemptComparisonModal 
        isOpen={!!compareId} 
        onOpenChange={(open) => !open && setCompareId(null)} 
        submissionId={compareId}
      />
    </div>
  );
}
