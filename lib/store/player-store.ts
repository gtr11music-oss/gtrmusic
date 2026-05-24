"use client";

import { create } from "zustand";
import type { MediaType, PodcastEpisode, Track } from "@/types";

export type QueueItem =
  | { type: "music"; track: Track }
  | { type: "podcast"; episode: PodcastEpisode };

interface PlayerState {
  queue: QueueItem[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  mediaType: MediaType | null;
  playTrack: (track: Track, queue?: Track[]) => void;
  playEpisode: (episode: PodcastEpisode, queue?: PodcastEpisode[]) => void;
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

function toMusicQueue(tracks: Track[]): QueueItem[] {
  return tracks.map((track) => ({ type: "music" as const, track }));
}

function toPodcastQueue(episodes: PodcastEpisode[]): QueueItem[] {
  return episodes.map((episode) => ({ type: "podcast" as const, episode }));
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: "off",
  mediaType: null,

  playTrack: (track, queue) => {
    const list = queue ?? [track];
    const items = toMusicQueue(list);
    const index = items.findIndex(
      (i) => i.type === "music" && i.track.id === track.id
    );
    set({
      queue: items,
      currentIndex: index >= 0 ? index : 0,
      isPlaying: true,
      mediaType: "music",
      progress: 0,
    });
  },

  playEpisode: (episode, queue) => {
    const list = queue ?? [episode];
    const items = toPodcastQueue(list);
    const index = items.findIndex(
      (i) => i.type === "podcast" && i.episode.id === episode.id
    );
    set({
      queue: items,
      currentIndex: index >= 0 ? index : 0,
      isPlaying: true,
      mediaType: "podcast",
      progress: 0,
    });
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),

  next: () => {
    const { queue, currentIndex, shuffle, repeat } = get();
    if (queue.length === 0) return;

    if (repeat === "one") {
      set({ progress: 0, isPlaying: true });
      return;
    }

    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeat === "all") nextIndex = 0;
      else {
        set({ isPlaying: false });
        return;
      }
    }

    if (shuffle && queue.length > 1) {
      let random = currentIndex;
      while (random === currentIndex) {
        random = Math.floor(Math.random() * queue.length);
      }
      nextIndex = random;
    }

    set({ currentIndex: nextIndex, progress: 0, isPlaying: true });
  },

  previous: () => {
    const { queue, currentIndex, progress } = get();
    if (queue.length === 0) return;

    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    set({ currentIndex: prevIndex, progress: 0, isPlaying: true });
  },

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  cycleRepeat: () =>
    set((s) => {
      const order: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const i = order.indexOf(s.repeat);
      return { repeat: order[(i + 1) % order.length] };
    }),
}));

export function useCurrentItem() {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  return queue[currentIndex] ?? null;
}
