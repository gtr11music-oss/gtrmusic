"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, getSiteUrl } from "@/lib/env";
import { profileToUser } from "@/lib/auth/profile-mapper";
import type { User } from "@/types";

export function useSupabaseAuth(): boolean {
  return isSupabaseConfigured();
}

export async function supabaseLogin(
  email: string,
  password: string
): Promise<{ ok: boolean; user?: User; error?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { ok: false, error: error.message };
  if (!data.user.email_confirmed_at) {
    await supabase.auth.signOut();
    return { ok: false, error: "يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    return { ok: false, error: "لم يتم العثور على الملف الشخصي" };
  }

  return { ok: true, user: profileToUser(profile) };
}

export async function supabaseRegister(
  name: string,
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createClient();
  const siteUrl = getSiteUrl();
  const { error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { display_name: name.trim() },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });
  if (error) return { ok: false, error: error.message };
  return {
    ok: true,
    error: undefined,
  };
}

export async function supabaseLogout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function fetchSessionUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email_confirmed_at) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return profile ? profileToUser(profile) : null;
}
