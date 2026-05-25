import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isServerFullyConfigured } from "@/lib/config/app-mode";
import { isSupabaseConfigured } from "@/lib/env";
import { getPublicSupabaseConfig, getServiceRoleKey } from "@/lib/env";
import { songRowToTrack } from "@/lib/catalog/map-song";
import type { Artist, Playlist, Track } from "@/types";

export const dynamic = "force-dynamic";

/** Public catalog for production UI (approved songs + playlists) */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ tracks: [], artists: [], playlists: [], mode: "offline" });
  }

  const client = getServiceRoleKey() ? createAdminClient() : await createClient();

  const { data: songs, error: songsErr } = await client
    .from("songs")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(200);

  if (songsErr) {
    return NextResponse.json({ error: songsErr.message }, { status: 500 });
  }

  const artistIds = [...new Set((songs ?? []).map((s) => s.artist_id))];
  const { data: profiles } = artistIds.length
    ? await client
        .from("profiles")
        .select("id, display_name, avatar_url, role")
        .in("id", artistIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const tracks: Track[] = (songs ?? []).map((s) => {
    const p = profileMap.get(s.artist_id);
    return songRowToTrack(s, p?.display_name ?? "فنان");
  });

  const artists: Artist[] = (profiles ?? []).map((p) => ({
    id: p.id,
    name: p.display_name,
    image: p.avatar_url ?? "/avatars/default.png",
    verified: p.role === "artist" || p.role === "admin",
  }));

  const { data: playlistRows } = await client
    .from("playlists")
    .select("id, title, description, cover_path, is_public")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(50);

  const { url } = getPublicSupabaseConfig();
  const coversBase = `${url}/storage/v1/object/public/covers`;

  const playlists: Playlist[] = (playlistRows ?? []).map((pl) => ({
    id: pl.id,
    title: pl.title,
    description: pl.description ?? "",
    cover: pl.cover_path ? `${coversBase}/${pl.cover_path}` : "/covers/playlist.jpg",
    trackIds: [],
    owner: "GTRmusic",
    isPublic: pl.is_public ?? true,
    createdAt: new Date().toISOString(),
  }));

  return NextResponse.json({
    tracks,
    artists,
    playlists,
    podcasts: [],
    mode: isServerFullyConfigured() ? "production" : "limited",
  });
}
