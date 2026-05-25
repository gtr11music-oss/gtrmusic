"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { songRowToTrack } from "@/lib/catalog/map-song";
import type { Track, Artist } from "@/types";

export function useSupabaseSearch(query: string) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured() || !query.trim()) {
      setTracks([]);
      setArtists([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((j) => {
        setTracks(
          (j.songs ?? []).map((s: Parameters<typeof songRowToTrack>[0]) =>
            songRowToTrack(s)
          )
        );
        setArtists(
          (j.profiles ?? []).map(
            (p: { id: string; display_name: string; avatar_url: string | null }) => ({
              id: p.id,
              name: p.display_name,
              image: p.avatar_url ?? "/avatars/default.png",
            })
          )
        );
      })
      .finally(() => setLoading(false));
  }, [query]);

  return { tracks, artists, loading };
}
