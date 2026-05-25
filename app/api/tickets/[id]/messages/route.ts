import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/api-guard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const { id } = await params;
  const { body } = await request.json();

  if (!body?.trim()) {
    return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: id,
      sender_id: auth.userId!,
      body: body.trim(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: data }, { status: 201 });
}
