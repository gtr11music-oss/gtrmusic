"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );

    const dismissedAt = localStorage.getItem("gtr-install-dismissed");
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 86400000) {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem("gtr-install-dismissed", String(Date.now()));
  };

  if (isStandalone || dismissed || !deferred) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 inset-x-4 z-[60] mx-auto max-w-md md:bottom-8 md:start-auto md:end-8"
      >
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-card p-4 shadow-2xl gtr-glow">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20">
            <Download className="size-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm">ثبّت تطبيق GTRmusic</p>
            <p className="text-xs text-muted-foreground">تجربة تطبيق كامل على هاتفك</p>
          </div>
          <Button size="sm" onClick={install} className="shrink-0">
            تثبيت
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={dismiss}>
            <X className="size-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
