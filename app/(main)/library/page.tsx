"use client";

import { motion } from "framer-motion";
import { Heart, Clock, Download } from "lucide-react";
import { TrackRow } from "@/components/music/track-row";
import { PlaylistCard } from "@/components/music/playlist-card";
import { CreatePlaylistDialog } from "@/components/community/create-playlist-dialog";
import { ar } from "@/lib/i18n/ar";
import { playlists } from "@/lib/data/mock";
import { useCommunityStore } from "@/lib/store/community-store";
import { useHistoryStore } from "@/lib/store/history-store";
import { usePublicCatalog } from "@/hooks/use-public-catalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LibraryPage() {
  const catalog = usePublicCatalog();
  const likedIds = useCommunityStore((s) => s.likedTracks);
  const userPlaylists = useCommunityStore((s) => s.userPlaylists);
  const historyEvents = useHistoryStore((s) => s.events);

  const recentIds = historyEvents.slice(0, 6).map((item) => item.trackId);

  const liked = likedIds
    .map((id) => catalog.getTrackById(id))
    .filter(Boolean) as typeof catalog.tracks;

  const recent = recentIds
    .map((id) => catalog.getTrackById(id))
    .filter(Boolean) as typeof catalog.tracks;

  const likedFallback = liked.length ? liked : catalog.tracks.slice(0, 4);
  const recentFallback = recent.length ? recent : catalog.tracks.slice(2, 6);

  return (
    <div className="p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 text-2xl font-bold md:text-3xl"
      >
        {ar.nav.library}
      </motion.h1>

      <Tabs defaultValue="liked" className="w-full">
        <TabsList className="mb-6 w-full justify-start bg-gtr-surface">
          <TabsTrigger value="liked" className="gap-2">
            <Heart className="size-4" />
            المفضلة
          </TabsTrigger>
          <TabsTrigger value="recent" className="gap-2">
            <Clock className="size-4" />
            الأخيرة
          </TabsTrigger>
          <TabsTrigger value="playlists" className="gap-2">
            قوائمي
          </TabsTrigger>
          <TabsTrigger value="downloads" className="gap-2">
            <Download className="size-4" />
            التنزيلات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liked">
          <div className="rounded-xl bg-gtr-surface/50 p-2">
            {likedFallback.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i + 1} queue={likedFallback} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="rounded-xl bg-gtr-surface/50 p-2">
            {recentFallback.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i + 1} queue={recentFallback} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="playlists">
          <div className="mb-4">
            <CreatePlaylistDialog trackIds={likedIds} />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...userPlaylists, ...playlists.slice(0, 2)].map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="downloads">
          <p className="text-muted-foreground">لا توجد تنزيلات بعد — Premium قريباً</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
