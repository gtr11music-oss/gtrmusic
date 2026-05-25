import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Task 18 — search approved songs */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ songs: [], profiles: [] });

  const supabase = await createClient();

  const [songsRes, profilesRes] = await Promise.all([
    supabase
      .from("songs")
      .select("id, title, genre, cover_path, artist_id, play_count")
      .eq("status", "approved")
      .ilike("title", `%${q}%`)
      .limit(20),
    supabase
      .from("profiles")
      .select("id, display_name, avatar_url, role")
      .ilike("display_name", `%${q}%`)
      .limit(10),
  ]);

  return NextResponse.json({
    songs: songsRes.data ?? [],
    profiles: profilesRes.data ?? [],
    error: songsRes.error?.message ?? profilesRes.error?.message,
  });
}
