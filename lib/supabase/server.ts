import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getPublicSupabaseConfig } from "@/lib/env";

/**
 * Server Component / Server Action client — respects RLS via user session cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getPublicSupabaseConfig();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component where cookies are read-only
        }
      },
    },
  });
}
