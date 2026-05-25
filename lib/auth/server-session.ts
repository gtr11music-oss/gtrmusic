import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";
import { isSupabaseConfigured } from "@/lib/env";

export async function getSessionProfile(): Promise<{
  userId: string | null;
  profile: ProfileRow | null;
}> {
  if (!isSupabaseConfigured()) {
    return { userId: null, profile: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { userId: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { userId: user.id, profile: profile ?? null };
}
