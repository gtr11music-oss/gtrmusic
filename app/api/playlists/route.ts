import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireRole } from "@/lib/auth/api-guard";

/** Task 19 — admin playlist CRUD */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("playlists")
    .select("*, playlist_songs(song_id, position)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ playlists: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("playlists")
    .insert({
      title,
      description: body.description ?? null,
      cover_path: body.cover_path ?? null,
      is_public: body.is_public ?? true,
      is_editorial: true,
      created_by: auth.userId!,
      owner_id: auth.userId!,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ playlist: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const id = body.id as string;
  if (!id) return NextResponse.json({ error: "المعرّف مطلوب" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("playlists")
    .update({
      title: body.title,
      description: body.description,
      cover_path: body.cover_path,
      is_public: body.is_public,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ playlist: data });
}

export async function DELETE(request: Request) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "المعرّف مطلوب" }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase.from("playlists").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
