import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "@/types";

interface NotificationsState {
  items: Notification[];
  pushEnabled: boolean;
  add: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: (userId: string) => void;
  unreadCount: (userId: string) => number;
  forUser: (userId: string) => Notification[];
  setPushEnabled: (v: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],
      pushEnabled: false,

      add: (n) =>
        set((s) => ({
          items: [
            {
              ...n,
              id: `n-${Date.now()}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...s.items,
          ].slice(0, 100),
        })),

      markRead: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
        })),

      markAllRead: (userId) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.userId === userId ? { ...i, read: true } : i
          ),
        })),

      unreadCount: (userId) =>
        get().items.filter((i) => i.userId === userId && !i.read).length,

      forUser: (userId) =>
        get().items.filter((i) => i.userId === userId).slice(0, 30),

      setPushEnabled: (pushEnabled) => set({ pushEnabled }),
    }),
    { name: "gtrmusic-notifications" }
  )
);
