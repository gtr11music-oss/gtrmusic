"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ListeningEvent } from "@/types";

interface HistoryState {
  events: ListeningEvent[];
  totalListenSeconds: number;
  recordListen: (event: Omit<ListeningEvent, "completedAt">) => void;
  getRecentTrackIds: (limit?: number) => string[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      events: [],
      totalListenSeconds: 0,

      recordListen: (event) =>
        set((s) => ({
          events: [
            { ...event, completedAt: new Date().toISOString() },
            ...s.events.slice(0, 499),
          ],
          totalListenSeconds: s.totalListenSeconds + event.listenedSeconds,
        })),

      getRecentTrackIds: (limit = 20) => {
        const seen = new Set<string>();
        const ids: string[] = [];
        for (const e of get().events) {
          if (!seen.has(e.trackId)) {
            seen.add(e.trackId);
            ids.push(e.trackId);
            if (ids.length >= limit) break;
          }
        }
        return ids;
      },
    }),
    { name: "gtrmusic-history" }
  )
);
