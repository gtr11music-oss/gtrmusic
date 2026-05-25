"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  getAdSenseClientId,
  getAdSenseSlot,
  isAdSenseEnabled,
} from "@/lib/google/config";

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

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSlot({ placement, className, label }: AdSlotProps) {
  const user = useAuthStore((s) => s.user);
  const isPremium = user?.isPremium === true;
  const pathname = usePathname();
  const pushed = useRef(false);
  const clientId = getAdSenseClientId();
  const slotId = getAdSenseSlot(placement);
  const adsenseOn = isAdSenseEnabled() && Boolean(slotId);

  useEffect(() => {
    if (isPremium) return;
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_path: pathname }),
    }).catch(() => {});
  }, [pathname, isPremium]);

  useEffect(() => {
    if (!adsenseOn || isPremium || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* script still loading */
    }
  }, [adsenseOn, isPremium, placement]);

  if (isPremium) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 overflow-hidden",
        placementSizes[placement],
        className
      )}
      data-ad-placement={placement}
      role="complementary"
      aria-label="إعلان"
    >
      {label && (
        <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      )}
      {adsenseOn ? (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block", minHeight: placement === "banner" ? 90 : 250 }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center p-4 text-center text-xs text-muted-foreground">
          <span>مساحة إعلان — {placement}</span>
          <span className="mt-1 opacity-70">
            {clientId
              ? "أضف NEXT_PUBLIC_ADSENSE_SLOT_* في Vercel"
              : "أضف NEXT_PUBLIC_ADSENSE_CLIENT_ID في Vercel"}
          </span>
        </div>
      )}
    </div>
  );
}
