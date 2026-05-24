"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function SponsorBanner({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-l from-primary/10 to-gtr-surface p-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Sparkles className="size-6 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">رعاية مستقبلية</p>
          <p className="font-semibold">مساحة بانر للرعاة والعلامات التجارية</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        تواصل معنا للإعلان على GTRmusic
      </p>
    </motion.div>
  );
}
