"use client";

import { create } from "zustand";

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  socialLinks: string[];
  documentName?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface VerificationState {
  requests: VerificationRequest[];

  submit: (data: {
    userId: string;
    userName: string;
    socialLinks: string[];
    documentName?: string;
  }) => void;

  approve: (id: string) => void;

  reject: (id: string) => void;

  getPending: () => VerificationRequest[];

  getForUser: (
    userId: string
  ) => VerificationRequest | undefined;
}

export const useVerificationStore =
  create<VerificationState>((set, get) => ({
    requests: [],

    submit: ({
      userId,
      userName,
      socialLinks,
      documentName,
    }) =>
      set((state) => ({
        requests: [
          {
            id: `verify-${Date.now()}`,
            userId,
            userName,
            socialLinks,
            documentName,
            status: "pending",
            createdAt: new Date().toISOString(),
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
  }));