import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireRole } from "@/lib/auth/api-guard";

/** Task 16 — artist upgrade requests */
export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist_requests")
    .insert({
      user_id: auth.userId!,
      social_links: body.social_links ?? [],
      document_path: body.document_path ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ request: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artist_requests")
    .update({
      status: body.status,
      admin_note: body.admin_note ?? null,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ request: data });
}
