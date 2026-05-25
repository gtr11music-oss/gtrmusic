import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig, getServiceRoleKey } from "@/lib/env";

/**
 * Service-role client — bypasses RLS. Use ONLY in:
 * - Webhook handlers (Task 21)
 * - Trusted server routes after authorization checks
 * NEVER import in client components.
 */
export function createAdminClient(): SupabaseClient {
  const { url } = getPublicSupabaseConfig();
  const serviceKey = getServiceRoleKey();
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for admin operations."
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
