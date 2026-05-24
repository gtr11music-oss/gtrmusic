"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PayoutRequest } from "@/types";
import { computeCreatorEarnings } from "@/lib/data/analytics";
import { PAYOUT_MINIMUM } from "@/lib/constants/monetization";

interface MonetizationState {
  baseStreams: number;
  baseFollowers: number;
  paidOutTotal: number;
  payouts: PayoutRequest[];

  payoutMethod: "stripe" | "paypal" | null;
  payoutEmail: string;

  incrementStreams: (n?: number) => void;

  setPayoutMethod: (
    method: "stripe" | "paypal",
    email: string
  ) => void;

  requestPayout: (
    amount: number
  ) => { ok: boolean; error?: string };

  getEarnings: () => ReturnType<typeof computeCreatorEarnings>;
}

export const useMonetizationStore =
  create<MonetizationState>()(
    persist(
      (set, get) => ({
        baseStreams: 125400,
        baseFollowers: 12800,
        paidOutTotal: 0,
        payouts: [],

        payoutMethod: null,
        payoutEmail: "",

        incrementStreams: (n = 1) =>
          set((state) => ({
            baseStreams: state.baseStreams + n,
          })),

        setPayoutMethod: (method, email) =>
          set({
            payoutMethod: method,
            payoutEmail: email,
          }),

        requestPayout: (amount) => {
          const state = get();

          const earnings = computeCreatorEarnings(
            state.baseStreams,
            state.baseFollowers,
            Math.round((state.baseStreams * 3.5) / 60),
            state.paidOutTotal
          );

          if (!earnings.eligible) {
            return {
              ok: false,
              error: "لم تستوفِ شروط الربح بعد",
            };
          }

          if (
            !state.payoutMethod ||
            !state.payoutEmail
          ) {
            return {
              ok: false,
              error:
                "يرجى إعداد Stripe أو PayPal أولاً",
            };
          }

          if (amount < PAYOUT_MINIMUM) {
            return {
              ok: false,
              error: `الحد الأدنى للسحب $${PAYOUT_MINIMUM}`,
            };
          }

          if (amount > earnings.availableBalance) {
            return {
              ok: false,
              error: "المبلغ يتجاوز الرصيد المتاح",
            };
          }

          const payout: PayoutRequest = {
            id: `pay-${Date.now()}`,
            amount,
            method: state.payoutMethod,
            accountEmail: state.payoutEmail,
            status: "pending",
            requestedAt: new Date()
              .toISOString()
              .split("T")[0],
          };

          set((state) => ({
            payouts: [payout, ...state.payouts],
            paidOutTotal:
              state.paidOutTotal + amount,
          }));

          return { ok: true };
        },

        getEarnings: () => {
          const state = get();

          const listenHours = Math.round(
            (state.baseStreams * 3.5) / 60
          );

          return computeCreatorEarnings(
            state.baseStreams,
            state.baseFollowers,
            listenHours,
            state.paidOutTotal
          );
        },
      }),
      {
        name: "gtrmusic-monetization",
      }
    )
  );