import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, getServiceRoleKey } from "@/lib/env";

const RPM_EGP = 0.02;

/** Task 23 — record page visit + projected earnings */
export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !getServiceRoleKey()) {
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  const { page_path } = await request.json();
  if (!page_path?.trim()) {
    return NextResponse.json({ error: "page_path مطلوب" }, { status: 400 });
  }

  const admin = createAdminClient();
  const path = page_path.trim();
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await admin
    .from("ad_stats")
    .select("id, visit_count")
    .eq("page_path", path)
    .eq("recorded_date", today)
    .maybeSingle();

  if (existing) {
    await admin
      .from("ad_stats")
      .update({ visit_count: existing.visit_count + 1 })
      .eq("id", existing.id);
  } else {
    await admin.from("ad_stats").insert({
      page_path: path,
      visit_count: 1,
      recorded_date: today,
    });
  }

  const { data: rows } = await admin
    .from("ad_stats")
    .select("visit_count")
    .eq("recorded_date", today);

  const totalVisits = (rows ?? []).reduce((s, r) => s + Number(r.visit_count), 0);
  const projected_egp = totalVisits * RPM_EGP;

  return NextResponse.json({ ok: true, totalVisits, projected_egp });
}
