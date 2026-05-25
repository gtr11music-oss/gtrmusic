"use client";

import { useEffect, useMemo, useState } from "react";
import { useUploadStore } from "@/lib/store/upload-store";
import { buildPublicCatalog } from "@/lib/catalog/public-catalog";
import {
  buildCatalogFromApi,
  type ApiCatalogPayload,
  type PublicCatalog,
} from "@/lib/catalog/build-api-catalog";
import { isDemoModeAllowed, isProductionApp } from "@/lib/config/app-mode";
import { isSupabaseConfigured } from "@/lib/env";
import type { UploadItem } from "@/types";

const emptyApi: ApiCatalogPayload = {
  tracks: [],
  artists: [],
  playlists: [],
  podcasts: [],
};

function filterPublished(uploads: UploadItem[]) {
  return uploads.filter((u) => u.status === "published");
}

export function usePublicCatalog(): PublicCatalog {
  const uploads = useUploadStore((s) => s.uploads);
  const [apiData, setApiData] = useState<ApiCatalogPayload | null>(null);
  const useProductionData =
    isProductionApp() || (isSupabaseConfigured() && !isDemoModeAllowed());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((j) => {
        setApiData({
          tracks: j.tracks ?? [],
          artists: j.artists ?? [],
          playlists: j.playlists ?? [],
          podcasts: j.podcasts ?? [],
        });
      })
      .catch(() => setApiData(emptyApi));
  }, []);

  return useMemo((): PublicCatalog => {
    const api = apiData ?? emptyApi;

    if (useProductionData) {
      return buildCatalogFromApi(api);
    }

    const mockTracks = buildPublicCatalog(filterPublished(uploads)).tracks;
    const trackIds = new Set(mockTracks.map((t) => t.id));
    return buildCatalogFromApi({
      tracks: [...mockTracks, ...api.tracks.filter((t) => !trackIds.has(t.id))],
      artists: api.artists.length ? api.artists : buildPublicCatalog([]).artists,
      playlists: api.playlists.length ? api.playlists : buildPublicCatalog([]).playlists,
      podcasts: buildPublicCatalog(filterPublished(uploads)).podcasts,
    });
  }, [uploads, apiData, useProductionData]);
}
