"use client";

import { tracks as mockTracks, podcastEpisodes as mockPodcasts } from "@/lib/data/mock";
import type { Track, PodcastEpisode, UploadItem } from "@/types";

const demoAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const cover = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/400`;

export function uploadToTrack(item: UploadItem): Track {
  return {
    id: item.id,
    title: item.title,
    artist: item.artist,
    artistId: item.uploadedBy ?? "a-upload",
    album: "رفع المستخدم",
    duration: 200,
    cover: item.cover ?? cover(item.title),
    audioUrl: demoAudio,
    genre: item.genre,
    plays: 0,
    uploadedAt: item.uploadedAt,
    uploadedBy: item.uploadedBy,
    status: "published",
  };
}

export function uploadToPodcast(item: UploadItem): PodcastEpisode {
  return {
    id: item.id,
    title: item.title,
    showId: `show-${item.uploadedBy}`,
    showName: item.artist,
    host: item.uploadedByName ?? item.artist,
    description: item.description ?? "",
    duration: 1800,
    cover: item.cover ?? cover(item.title),
    audioUrl: demoAudio,
    publishedAt: item.uploadedAt,
    plays: 0,
    status: "published",
    uploadedBy: item.uploadedBy,
  };
}

/** محتوى عام — mock + المنشور بعد موافقة الإدارة فقط */
export function getPublicTracks(publishedUploads: UploadItem[]): Track[] {
  const fromUploads = publishedUploads
    .filter((u) => u.type === "music")
    .map(uploadToTrack);
  return [...mockTracks, ...fromUploads];
}

export function getPublicPodcasts(publishedUploads: UploadItem[]): PodcastEpisode[] {
  const fromUploads = publishedUploads
    .filter((u) => u.type === "podcast")
    .map(uploadToPodcast);
  return [...mockPodcasts, ...fromUploads];
}
