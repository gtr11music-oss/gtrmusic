"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSupabaseAuth, fetchSessionUser } from "@/lib/auth/client-auth";
import { useAuthStore } from "@/lib/store/auth-store";

/** Hydrates Zustand from Supabase session (Tasks 11–12). */
export function SessionSync() {
  const useSupabase = useSupabaseAuth();
  const setSession = useAuthStore((s) => s.setSession);
  const pathname = usePathname();

  useEffect(() => {
    if (!useSupabase) return;
    fetchSessionUser().then((user) => {
      if (user) setSession(user);
    });
  }, [useSupabase, setSession, pathname]);

  return null;
}
