"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoUser } from "@/lib/data/mock";
import type { User, UserRole } from "@/types";

function hashPassword(pw: string): string {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h << 5) - h + pw.charCodeAt(i);
  return `h${Math.abs(h)}`;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  passwordHash: string | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  setRole: (role: UserRole) => void;
  setVerified: (verified: boolean) => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "bio" | "avatar" | "socialLinks">>) => void;
}

function resolveRole(email: string): UserRole {
  const e = email.toLowerCase();
  if (e.startsWith("admin")) return "admin";
  if (e.startsWith("artist") || e.startsWith("verified")) return "verified_artist";
  return "user";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      passwordHash: null,

      login: (email, password) => {
        if (!email.trim()) return { ok: false, error: "أدخل البريد الإلكتروني" };
        if (password.length < 6) return { ok: false, error: "كلمة المرور 6 أحرف على الأقل" };
        const normalized = email.trim().toLowerCase();
        const stored = get().passwordHash;
        const hash = hashPassword(password);
        if (stored && stored !== hash) {
          return { ok: false, error: "كلمة المرور غير صحيحة" };
        }
        const role = resolveRole(normalized);
        const user: User = {
          ...demoUser,
          email: normalized,
          name: normalized.split("@")[0] || demoUser.name,
          role,
          verified: role === "verified_artist" || role === "admin",
        };
        set({ user, isAuthenticated: true, passwordHash: hash });
        return { ok: true };
      },

      register: (name, email, password) => {
        if (!email.trim() || !name.trim()) return { ok: false, error: "أكمل الحقول" };
        if (password.length < 6) return { ok: false, error: "كلمة المرور 6 أحرف على الأقل" };
        const hash = hashPassword(password);
        const user: User = {
          ...demoUser,
          id: `u-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: "user",
          verified: false,
        };
        set({ user, isAuthenticated: true, passwordHash: hash });
        return { ok: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setRole: (role) =>
        set((s) => (s.user ? { user: { ...s.user, role } } : s)),

      setVerified: (verified) =>
        set((s) =>
          s.user
            ? {
                user: {
                  ...s.user,
                  verified,
                  role: verified ? "verified_artist" : s.user.role === "admin" ? "admin" : "user",
                },
              }
            : s
        ),

      updateProfile: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
    }),
    { name: "gtrmusic-auth" }
  )
);
