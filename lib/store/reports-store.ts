"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Report,
  ReportType,
  CopyrightStrike,
} from "@/types";

const seedReports: Report[] = [
  {
    id: "r1",
    type: "stolen_music",
    targetType: "track",
    targetId: "t1",
    targetLabel: "يا هوى",
    reporterId: "u2",
    reporterName: "مستخدم",
    description: "الأغنية مسروقة من فنان آخر",
    status: "pending",
    createdAt: "2025-05-20",
  },
];

interface ReportsState {
  reports: Report[];

  strikes: CopyrightStrike[];

  submitReport: (
    type: ReportType,
    targetType: Report["targetType"],
    targetId: string,
    targetLabel: string,
    reporterId: string,
    reporterName: string,
    description: string
  ) => void;

  resolveReport: (
    id: string,
    action: "resolve" | "dismiss"
  ) => void;

  getUserStrikes: (
    userId: string
  ) => number;
}

export const useReportsStore =
  create<ReportsState>()(
    persist(
      (set, get) => ({
        reports: seedReports,

        strikes: [],

        submitReport: (
          type,
          targetType,
          targetId,
          targetLabel,
          reporterId,
          reporterName,
          description
        ) =>
          set((state) => ({
            reports: [
              {
                id: `r-${Date.now()}`,
                type,
                targetType,
                targetId,
                targetLabel,
                reporterId,
                reporterName,
                description,
                status: "pending",
                createdAt: new Date()
                  .toISOString()
                  .split("T")[0],
              },

              ...state.reports,
            ],
          })),

        resolveReport: (id, action) =>
          set((state) => ({
            reports: state.reports.map((report) =>
              report.id === id
                ? {
                    ...report,
                    status:
                      action === "resolve"
                        ? "resolved"
                        : "dismissed",
                  }
                : report
            ),
          })),

        getUserStrikes: (userId) =>
          get().strikes.filter(
            (strike) =>
              strike.userId === userId &&
              strike.active
          ).length,
      }),

      {
        name: "gtrmusic-reports",
      }
    )
  );