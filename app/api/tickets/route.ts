import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/api-guard";

/** Task 17 — list/create support tickets */
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const isStaff =
    auth.profile!.role === "support" || auth.profile!.role === "admin";

  let query = supabase.from("support_tickets").select("*").order("created_at", {
    ascending: false,
  });

  if (!isStaff) {
    query = query.eq("user_id", auth.userId!);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tickets: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { subject } = await request.json();
  if (!subject?.trim()) {
    return NextResponse.json({ error: "الموضوع مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .insert({ user_id: auth.userId!, subject: subject.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ticket: data }, { status: 201 });
}
