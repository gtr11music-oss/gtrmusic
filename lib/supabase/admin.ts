import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getPublicSupabaseConfig, getServiceRoleKey } from "@/lib/env";

/**
 * Service-role client — bypasses RLS. Use ONLY in:
 * - Webhook handlers (Task 21)
 * - Trusted server actions after explicit authorization checks
 * NEVER import in client components.
 */
export function createAdminClient() {
  const { url } = getPublicSupabaseConfig();
  const serviceKey = getServiceRoleKey();
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations."
    );
  }
  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
