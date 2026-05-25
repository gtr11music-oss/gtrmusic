import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/api-guard";

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { song_id } = await request.json();
  if (!song_id) {
    return NextResponse.json({ error: "song_id مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("likes").insert({
    user_id: auth.userId!,
    song_id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const song_id = new URL(request.url).searchParams.get("song_id");
  if (!song_id) {
    return NextResponse.json({ error: "song_id مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", auth.userId!)
    .eq("song_id", song_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
