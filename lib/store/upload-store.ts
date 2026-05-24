"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UploadItem } from "@/types";

interface UploadState {
  uploads: UploadItem[];
  addUpload: (
    item: Omit<UploadItem, "id" | "uploadedAt" | "status"> & { status?: never }
  ) => UploadItem;
  updateStatus: (id: string, status: UploadItem["status"]) => void;
  getPending: () => UploadItem[];
  getPublished: () => UploadItem[];
}

export const useUploadStore = create<UploadState>()(
  persist(
    (set, get) => ({
      uploads: [],

      addUpload: (item) => {
        const upload: UploadItem = {
          ...item,
          id: `up-${Date.now()}`,
          status: "pending",
          uploadedAt: new Date().toISOString().split("T")[0],
        };
        set((s) => ({ uploads: [upload, ...s.uploads] }));
        return upload;
      },

      updateStatus: (id, status) =>
        set((s) => ({
          uploads: s.uploads.map((u) => (u.id === id ? { ...u, status } : u)),
        })),

      getPending: () =>
        get().uploads.filter((u) => u.status === "pending" || u.status === "processing"),

      getPublished: () => get().uploads.filter((u) => u.status === "published"),
    }),
    { name: "gtrmusic-uploads" }
  )
);
