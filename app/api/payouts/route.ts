import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/api-guard";

/** Task 22 — Mashreq payout request metadata */
export async function POST(request: Request) {
  const auth = await requireRole(["artist", "admin"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const amount_cents = Number(body.amount_cents);
  const mashreq_account_ref = String(body.mashreq_account_ref ?? "").trim();
  const mashreq_iban = String(body.mashreq_iban ?? "").trim();

  if (!amount_cents || amount_cents < 100) {
    return NextResponse.json({ error: "المبلغ غير صالح" }, { status: 400 });
  }
  if (!mashreq_account_ref && !mashreq_iban) {
    return NextResponse.json({ error: "بيانات البنك مطلوبة" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artist_payouts")
    .insert({
      artist_id: auth.userId!,
      amount_cents,
      mashreq_account_ref: mashreq_account_ref || null,
      mashreq_iban: mashreq_iban || null,
      currency: "EGP",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ payout: data }, { status: 201 });
}
