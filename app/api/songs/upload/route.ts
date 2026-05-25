import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/api-guard";

/** Task 14 — upload MP3 + cover to storage, insert pending song */
export async function POST(request: Request) {
  const auth = await requireRole(["artist", "admin"]);
  if (auth.error) return auth.error;

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const genre = String(form.get("genre") ?? "").trim() || null;
  const audio = form.get("audio");
  const cover = form.get("cover");

  if (!title || !(audio instanceof File)) {
    return NextResponse.json({ error: "العنوان وملف الصوت مطلوبان" }, { status: 400 });
  }

  const supabase = await createClient();
  const userId = auth.userId!;
  const audioPath = `${userId}/${Date.now()}-${audio.name.replace(/\s+/g, "-")}`;

  const { error: audioError } = await supabase.storage
    .from("audio")
    .upload(audioPath, audio, { contentType: audio.type || "audio/mpeg", upsert: false });

  if (audioError) {
    return NextResponse.json({ error: audioError.message }, { status: 400 });
  }

  let coverPath: string | null = null;
  if (cover instanceof File && cover.size > 0) {
    coverPath = `${userId}/${Date.now()}-${cover.name.replace(/\s+/g, "-")}`;
    const { error: coverError } = await supabase.storage
      .from("covers")
      .upload(coverPath, cover, { contentType: cover.type || "image/jpeg", upsert: false });
    if (coverError) {
      await supabase.storage.from("audio").remove([audioPath]);
      return NextResponse.json({ error: coverError.message }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("songs")
    .insert({
      artist_id: userId,
      title,
      genre,
      audio_path: audioPath,
      cover_path: coverPath,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ song: data }, { status: 201 });
}
