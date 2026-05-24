"use client";

import { cn } from "@/lib/utils";
import { usePremiumStore } from "@/lib/store/premium-store";

interface AdSlotProps {
  placement: "sidebar" | "banner" | "in-feed" | "player";
  className?: string;
  label?: string;
}

const placementSizes: Record<AdSlotProps["placement"], string> = {
  sidebar: "min-h-[250px] w-full",
  banner: "min-h-[90px] w-full max-w-4xl mx-auto",
  "in-feed": "min-h-[120px] w-full",
  player: "min-h-[50px] w-full max-w-md",
};

/** حاوية جاهزة لـ Google AdSense — استبدل data-ad-slot بمعرفك */
export function AdSlot({ placement, className, label }: AdSlotProps) {
  const isPremium = usePremiumStore((s) => s.isPremium);

  if (isPremium) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20",
        placementSizes[placement],
        className
      )}
      data-ad-placement={placement}
      role="complementary"
      aria-label="إعلان"
    >
      <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label ?? "إعلان"}
      </p>
      <div
        className="flex size-full items-center justify-center text-center text-xs text-muted-foreground"
        data-ad-client="ca-pub-XXXXXXXX"
        data-ad-slot={`gtr-${placement}`}
      >
        {/* Google AdSense: ins.adsbygoogle */}
        <span>مساحة AdSense — {placement}</span>
      </div>
    </div>
  );
}
