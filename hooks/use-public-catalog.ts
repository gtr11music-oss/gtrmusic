"use client";

import { useEffect, useMemo, useState } from "react";
import { useUploadStore } from "@/lib/store/upload-store";
import { buildPublicCatalog } from "@/lib/catalog/public-catalog";
import { fetchApprovedTracksFromApi } from "@/lib/catalog/fetch-supabase-songs";
import { isSupabaseConfigured } from "@/lib/env";
import type { Track, UploadItem } from "@/types";

function filterPublished(uploads: UploadItem[]) {
  return uploads.filter((u) => u.status === "published");
}

/**
 * لا تستخدم getPublished() داخل selector — يُرجع مصفوفة جديدة كل render
 * فيسبب: "getServerSnapshot should be cached to avoid an infinite loop"
 */
export function usePublicCatalog() {
  const uploads = useUploadStore((s) => s.uploads);
  const [remoteTracks, setRemoteTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    fetchApprovedTracksFromApi().then(setRemoteTracks);
  }, []);

  return useMemo(() => {
    const mockCatalog = buildPublicCatalog(filterPublished(uploads));
    if (remoteTracks.length === 0) return mockCatalog;
    const trackIds = new Set(mockCatalog.tracks.map((t) => t.id));
    const mergedTracks = [
      ...mockCatalog.tracks,
      ...remoteTracks.filter((t) => !trackIds.has(t.id)),
    ];
    return { ...mockCatalog, tracks: mergedTracks };
  }, [uploads, remoteTracks]);
}
