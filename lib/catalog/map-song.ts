import type { Track } from "@/types";
import type { Database } from "@/types/database";
import { getPublicSupabaseConfig } from "@/lib/env";

type SongRow = Database["public"]["Tables"]["songs"]["Row"];

export function songRowToTrack(song: SongRow, artistName = "فنان"): Track {
  const { url } = getPublicSupabaseConfig();
  const coversBase = `${url}/storage/v1/object/public/covers`;

  return {
    id: song.id,
    title: song.title,
    artist: artistName,
    artistId: song.artist_id,
    album: song.genre ?? "ألبوم",
    duration: song.duration_seconds ?? 0,
    cover: song.cover_path ? `${coversBase}/${song.cover_path}` : "/covers/default.jpg",
    audioUrl: `/api/songs/${song.id}/play`,
    genre: song.genre ?? "عربي",
    plays: Number(song.play_count),
    status: song.status === "approved" ? "published" : song.status,
    uploadedAt: song.created_at,
    uploadedBy: song.artist_id,
  };
}
