import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/api-guard";
import { getServiceRoleKey, isSupabaseConfigured } from "@/lib/env";
import { isProductionApp } from "@/lib/config/app-mode";

const RPM_EGP = 0.02;

/** Task 25 — platform overview for admin */
export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  if (!isSupabaseConfigured() || !getServiceRoleKey()) {
    if (isProductionApp()) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY مطلوب في الإنتاج" },
        { status: 503 }
      );
    }
    return NextResponse.json({ mode: "mock" });
  }

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const [profiles, pendingSongs, adRows, subscriptions] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("songs").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("ad_stats").select("visit_count").eq("recorded_date", today),
    admin
      .from("user_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const visits = (adRows.data ?? []).reduce((s, r) => s + Number(r.visit_count), 0);

  return NextResponse.json({
    users_count: profiles.count ?? 0,
    pending_songs: pendingSongs.count ?? 0,
    premium_subscribers: subscriptions.count ?? 0,
    ad_visits_today: visits,
    projected_ad_egp: visits * RPM_EGP,
  });
}
