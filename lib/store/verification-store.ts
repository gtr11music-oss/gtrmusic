"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  documentName?: string;
  socialLinks: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface VerificationState {
  requests: VerificationRequest[];

  submit: (
    request: Omit<
      VerificationRequest,
      "id" | "status" | "createdAt"
    >
  ) => void;

  approve: (id: string) => void;

  reject: (id: string) => void;

  getPending: () => VerificationRequest[];

  getForUser: (
    userId: string
  ) => VerificationRequest | undefined;
}

export const useVerificationStore =
  create<VerificationState>()(
    persist(
      (set, get) => ({
        requests: [],

        submit: (request) =>
          set((state) => ({
            requests: [
              {
                id: `vr-${Date.now()}`,
                userId: request.userId,
                userName: request.userName,
                documentName:
                  request.documentName,
                socialLinks:
                  request.socialLinks || [],
                status: "pending",
                createdAt:
                  new Date().toISOString(),
              },

              ...state.requests,
            ],
          })),

        approve: (id) =>
          set((state) => ({
            requests: state.requests.map((r) =>
              r.id === id
                ? {
                    ...r,
                    status: "approved",
                  }
                : r
            ),
          })),

        reject: (id) =>
          set((state) => ({
            requests: state.requests.map((r) =>
              r.id === id
                ? {
                    ...r,
                    status: "rejected",
                  }
                : r
            ),
          })),

        getPending: () =>
          get().requests.filter(
            (r) => r.status === "pending"
          ),

        getForUser: (userId) =>
          get().requests.find(
            (r) => r.userId === userId
          ),
      }),
      {
        name: "gtrmusic-verification",
      }
    )
  );