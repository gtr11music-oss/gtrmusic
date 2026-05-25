import {
  artists,
  playlists,
  tracks as mockTracks,
  podcastEpisodes as mockPodcasts,
  getArtistById as mockGetArtist,
} from "@/lib/data/mock";
import {
  getPublicTracks,
  getPublicPodcasts,
  uploadToTrack,
  uploadToPodcast,
} from "@/lib/store/content-store";
import type { Track, PodcastEpisode, UploadItem, Artist, Playlist } from "@/types";
import { getSmartTrending as aiSmartTrending } from "@/lib/ai/recommendations";

export function buildPublicCatalog(published: UploadItem[]) {
  const tracks = getPublicTracks(published);
  const podcasts = getPublicPodcasts(published);

  const getTrackById = (id: string): Track | undefined => {
    return tracks.find((t) => t.id === id);
  };

  const getPodcastById = (id: string): PodcastEpisode | undefined => {
    return podcasts.find((p) => p.id === id);
  };

  const searchAll = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return { tracks: [] as Track[], artists: [] as Artist[], podcasts: [] as PodcastEpisode[] };
    return {
      tracks: tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.genre.toLowerCase().includes(q)
      ),
      artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
      podcasts: podcasts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.showName.toLowerCase().includes(q) ||
          p.host.toLowerCase().includes(q)
      ),
    };
  };

  const smartTrending = () => aiSmartTrending(tracks);

  return {
    tracks,
    podcasts,
    artists,
    playlists,
    getTrackById,
    getPodcastById,
    getArtistById: mockGetArtist,
    searchAll,
    smartTrending,
    uploadToTrack,
    uploadToPodcast,
  };
}

export type PublicCatalog = ReturnType<typeof buildPublicCatalog>;

/** للصفحات الثابتة بدون store */
export const staticCatalog = buildPublicCatalog([]);
