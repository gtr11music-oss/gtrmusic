import type { Artist, Playlist, PodcastEpisode, Track } from "@/types";
import { getSmartTrending } from "@/lib/ai/recommendations";

export type ApiCatalogPayload = {
  tracks: Track[];
  artists: Artist[];
  playlists: Playlist[];
  podcasts: PodcastEpisode[];
};

export function buildCatalogFromApi(data: ApiCatalogPayload) {
  const { tracks, artists, playlists, podcasts } = data;

  const getTrackById = (id: string) => tracks.find((t) => t.id === id);
  const getPodcastById = (id: string) => podcasts.find((p) => p.id === id);
  const getArtistById = (id: string) => artists.find((a) => a.id === id);

  const searchAll = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return { tracks: [], artists: [], podcasts: [] };
    return {
      tracks: tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          (t.genre?.toLowerCase().includes(q) ?? false)
      ),
      artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
      podcasts: podcasts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.showName.toLowerCase().includes(q)
      ),
    };
  };

  return {
    tracks,
    podcasts,
    artists,
    playlists,
    getTrackById,
    getPodcastById,
    getArtistById,
    searchAll,
    smartTrending: () => getSmartTrending(tracks),
    uploadToTrack: () => undefined,
    uploadToPodcast: () => undefined,
  };
}

export type PublicCatalog = ReturnType<typeof buildCatalogFromApi>;
