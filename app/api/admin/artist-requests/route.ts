import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/api-guard";
import { getServiceRoleKey, isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  if (!isSupabaseConfigured() || !getServiceRoleKey()) {
    return NextResponse.json({ requests: [] });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("artist_requests")
    .select("*, profiles!artist_requests_user_id_fkey(display_name, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    const { data: fallback, error: err2 } = await admin
      .from("artist_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });
    return NextResponse.json({ requests: fallback ?? [] });
  }

  return NextResponse.json({ requests: data ?? [] });
}
