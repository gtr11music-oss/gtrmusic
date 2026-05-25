import type { Track } from "@/types";
import { songRowToTrack } from "@/lib/catalog/map-song";

export async function fetchApprovedTracksFromApi(): Promise<Track[]> {
  const res = await fetch("/api/songs?status=approved&limit=50");
  if (!res.ok) return [];
  const json = await res.json();
  const songs = json.songs ?? [];
  return songs.map((s: { id: string; title: string; artist_id: string; genre: string | null; audio_path: string; cover_path: string | null; duration_seconds: number | null; status: string; play_count: number; created_at: string }) =>
    songRowToTrack(s as Parameters<typeof songRowToTrack>[0])
  );
}
