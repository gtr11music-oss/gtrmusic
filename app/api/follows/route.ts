import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/api-guard";

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const { following_id } = await request.json();
  if (!following_id || following_id === auth.userId) {
    return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("follows").insert({
    follower_id: auth.userId!,
    following_id,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const following_id = new URL(request.url).searchParams.get("following_id");
  if (!following_id) {
    return NextResponse.json({ error: "معرّف مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", auth.userId!)
    .eq("following_id", following_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
