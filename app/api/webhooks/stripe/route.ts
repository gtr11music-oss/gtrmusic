import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServiceRoleKey } from "@/lib/env";

/**
 * Task 21 — Stripe webhook stub (no card data stored locally).
 * Set STRIPE_WEBHOOK_SECRET and verify signature in production.
 */
export async function POST(request: Request) {
  if (!getServiceRoleKey()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  }

  const payload = await request.json();
  const eventType = payload?.type as string | undefined;
  const userId = payload?.data?.object?.metadata?.user_id as string | undefined;
  const externalId = payload?.data?.object?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const admin = createAdminClient();
  let status: "active" | "canceled" | "past_due" | "trialing" = "active";

  if (eventType?.includes("deleted") || eventType?.includes("canceled")) {
    status = "canceled";
  } else if (eventType?.includes("past_due")) {
    status = "past_due";
  }

  const { data: existing } = await admin
    .from("user_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const row = {
    user_id: userId,
    provider: "stripe",
    external_id: externalId ?? null,
    status,
    current_period_end: new Date(Date.now() + 30 * 864e5).toISOString(),
  };

  if (existing) {
    await admin.from("user_subscriptions").update(row).eq("id", existing.id);
  } else {
    await admin.from("user_subscriptions").insert(row);
  }

  return NextResponse.json({ received: true });
}
