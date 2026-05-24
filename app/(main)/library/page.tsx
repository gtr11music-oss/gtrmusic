"use client";

import { motion } from "framer-motion";
import { Heart, Clock, Download } from "lucide-react";
import { TrackRow } from "@/components/music/track-row";
import { PlaylistCard } from "@/components/music/playlist-card";
import { ar } from "@/lib/i18n/ar";
import {
  tracks,
  playlists,
  getTrackById,
} from "@/lib/data/mock";

import { useCommunityStore } from "@/lib/store/community-store";
import { useHistoryStore } from "@/lib/store/history-store";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function LibraryPage() {
  // المفضلة
  const likedIds = useCommunityStore(
    (s) => s.likedTracks
  );

  // البلاي ليست
  const userPlaylists = useCommunityStore(
    (s) => s.userPlaylists
  );

  // إصلاح مشكلة Infinite Loop
  // بدل getRecentTrackIds()
  const historyEvents = useHistoryStore(
    (s) => s.events
  );

  // آخر الأغاني
  const recentIds = historyEvents
    .slice(0, 6)
    .map((item) => item.trackId);

  // المفضلة الحقيقية
  const liked = likedIds
    .map((id) => getTrackById(id))
    .filter(Boolean) as typeof tracks;

  // الأخيرة الحقيقية
  const recent = recentIds
    .map((id) => getTrackById(id))
    .filter(Boolean) as typeof tracks;

  // fallback
  const likedFallback = liked.length
    ? liked
    : tracks.slice(0, 4);

  const recentFallback = recent.length
    ? recent
    : tracks.slice(2, 6);

  return (
    <div className="p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 text-2xl font-bold md:text-3xl"
      >
        {ar.nav.library}
      </motion.h1>

      <Tabs
        defaultValue="liked"
        className="w-full"
      >
        <TabsList className="mb-6 w-full justify-start bg-gtr-surface">
          <TabsTrigger
            value="liked"
            className="gap-2"
          >
            <Heart className="size-4" />
            المفضلة
          </TabsTrigger>

          <TabsTrigger
            value="recent"
            className="gap-2"
          >
            <Clock className="size-4" />
            الأخيرة
          </TabsTrigger>

          <TabsTrigger
            value="playlists"
            className="gap-2"
          >
            قوائمي
          </TabsTrigger>

          <TabsTrigger
            value="downloads"
            className="gap-2"
          >
            <Download className="size-4" />
            التنزيلات
          </TabsTrigger>
        </TabsList>

        {/* المفضلة */}
        <TabsContent value="liked">
          <div className="rounded-xl bg-gtr-surface/50 p-2">
            {likedFallback.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i + 1}
                queue={likedFallback}
              />
            ))}
          </div>
        </TabsContent>

        {/* الأخيرة */}
        <TabsContent value="recent">
          <div className="rounded-xl bg-gtr-surface/50 p-2">
            {recentFallback.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i + 1}
                queue={recentFallback}
              />
            ))}
          </div>
        </TabsContent>

        {/* البلاي ليست */}
        <TabsContent value="playlists">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              ...userPlaylists,
              ...playlists.slice(0, 2),
            ].map((p) => (
              <PlaylistCard
                key={p.id}
                playlist={p}
              />
            ))}
          </div>
        </TabsContent>

        {/* التنزيلات */}
        <TabsContent value="downloads">
          <p className="text-muted-foreground">
            لا توجد تنزيلات بعد
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}