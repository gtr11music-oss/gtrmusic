import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, AppRole } from "@/types/database";

type Client = SupabaseClient<Database>;

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

/** Fetch the signed-in user's profile (Task 2+). Returns null if unauthenticated. */
export async function getCurrentProfile(
  supabase: Client
): Promise<ProfileRow | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function hasRole(profile: ProfileRow | null, role: AppRole): boolean {
  return profile?.role === role;
}

export function isPremium(profile: ProfileRow | null): boolean {
  return profile?.is_premium === true;
}
