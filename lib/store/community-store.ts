"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Comment, Playlist } from "@/types";

interface CommunityState {
  likedTracks: string[];
  followedArtists: string[];
  comments: Comment[];
  userPlaylists: Playlist[];
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
  toggleFollow: (artistId: string) => void;
  isFollowing: (artistId: string) => boolean;
  addComment: (
    trackId: string,
    userId: string,
    userName: string,
    text: string,
    userVerified?: boolean
  ) => void;
  getComments: (trackId: string) => Comment[];
  addPlaylist: (playlist: Omit<Playlist, "id" | "createdAt">) => void;
  shareTrack: (trackId: string) => string;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      likedTracks: [],
      followedArtists: [],
      comments: [],
      userPlaylists: [],

      toggleLike: (trackId) =>
        set((s) => ({
          likedTracks: s.likedTracks.includes(trackId)
            ? s.likedTracks.filter((id) => id !== trackId)
            : [...s.likedTracks, trackId],
        })),

      isLiked: (trackId) => get().likedTracks.includes(trackId),

      toggleFollow: (artistId) =>
        set((s) => ({
          followedArtists: s.followedArtists.includes(artistId)
            ? s.followedArtists.filter((id) => id !== artistId)
            : [...s.followedArtists, artistId],
        })),

      isFollowing: (artistId) => get().followedArtists.includes(artistId),

      addComment: (trackId, userId, userName, text, userVerified?: boolean) =>
        set((s) => ({
          comments: [
            {
              id: `c-${Date.now()}`,
              trackId,
              userId,
              userName,
              userVerified,
              text,
              createdAt: new Date().toISOString(),
            },
            ...s.comments,
          ],
        })),

      getComments: (trackId) =>
        get().comments.filter((c) => c.trackId === trackId),

      addPlaylist: (playlist) =>
        set((s) => ({
          userPlaylists: [
            {
              ...playlist,
              id: `pl-${Date.now()}`,
              createdAt: new Date().toISOString().split("T")[0],
            },
            ...s.userPlaylists,
          ],
        })),

      shareTrack: (trackId) => {
        if (typeof window !== "undefined") {
          return `${window.location.origin}/track/${trackId}`;
        }
        return `/track/${trackId}`;
      },
    }),
    { name: "gtrmusic-community" }
  )
);
