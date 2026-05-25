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
  publishItem: (item: UploadItem) => void;
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

      publishItem: (item) =>
        set((s) => {
          const exists = s.uploads.some((u) => u.id === item.id);
          if (exists) {
            return {
              uploads: s.uploads.map((u) =>
                u.id === item.id ? { ...u, status: "published" } : u
              ),
            };
          }
          return {
            uploads: [{ ...item, status: "published" }, ...s.uploads],
          };
        }),

      getPending: () =>
        get().uploads.filter((u) => u.status === "pending" || u.status === "processing"),

      /** للاستخدام خارج React selectors فقط — لا تمرّره لـ useUploadStore(selector) */
      getPublished: () => get().uploads.filter((u) => u.status === "published"),
    }),
    { name: "gtrmusic-uploads" }
  )
);
