"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PREMIUM_PRICE_MONTHLY } from "@/lib/constants/monetization";

interface PremiumState {
  isPremium: boolean;
  expiresAt: string | null;
  subscribe: () => void;
  cancel: () => void;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set) => ({
      isPremium: false,
      expiresAt: null,

      subscribe: () => {
        const expires = new Date();
        expires.setMonth(expires.getMonth() + 1);
        set({
          isPremium: true,
          expiresAt: expires.toISOString().split("T")[0],
        });
      },

      cancel: () => set({ isPremium: false, expiresAt: null }),
    }),
    { name: "gtrmusic-premium" }
  )
);

export const PREMIUM_FEATURES = [
  "استماع بدون إعلانات",
  "جودة صوت عالية",
  "تنزيل للاستماع دون اتصال",
  "دعم الفنانين المفضلين",
];

export { PREMIUM_PRICE_MONTHLY };
