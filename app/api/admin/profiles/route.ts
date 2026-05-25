import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/api-guard";
import { getServiceRoleKey, isSupabaseConfigured } from "@/lib/env";

/** Task 25 — list users for admin dashboard */
export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  if (!isSupabaseConfigured() || !getServiceRoleKey()) {
    return NextResponse.json({ profiles: [], mode: "mock" });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, display_name, role, is_premium, email_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profiles: data ?? [] });
}
