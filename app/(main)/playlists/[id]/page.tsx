"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackRow } from "@/components/music/track-row";
import { getPlaylistById } from "@/lib/data/mock";
import { usePlayerStore } from "@/lib/store/player-store";
import { usePublicCatalog } from "@/hooks/use-public-catalog";
import { useCommunityStore } from "@/lib/store/community-store";
import type { Track } from "@/types";

export default function PlaylistDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const catalog = usePublicCatalog();
  const userPlaylists = useCommunityStore((s) => s.userPlaylists);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const playlist =
    getPlaylistById(id) ?? userPlaylists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-16">
        <p className="text-muted-foreground">قائمة التشغيل غير موجودة</p>
        <Button asChild variant="outline">
          <Link href="/playlists">العودة للقوائم</Link>
        </Button>
      </div>
    );
  }

  const playlistTracks = playlist.trackIds
    .map((tid) => catalog.getTrackById(tid))
    .filter((t): t is Track => Boolean(t));

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end"
      >
        <div className="relative size-48 shrink-0 overflow-hidden rounded-xl shadow-2xl sm:size-56">
          <Image
            src={playlist.cover}
            alt={playlist.title}
            fill
            className="object-cover"
            sizes="224px"
            priority
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">قائمة تشغيل</p>
          <h1 className="text-3xl font-bold md:text-5xl">{playlist.title}</h1>
          <p className="mt-2 text-muted-foreground">{playlist.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {playlistTracks.length} أغاني • {playlist.owner}
          </p>
          <Button
            className="mt-4 gap-2 bg-gtr-accent text-black hover:bg-gtr-accent/90"
            size="lg"
            onClick={() => playlistTracks[0] && playTrack(playlistTracks[0], playlistTracks)}
          >
            <Play className="size-5 fill-current" />
            تشغيل
          </Button>
        </div>
      </motion.div>

      <div className="rounded-xl bg-gtr-surface/50 p-2">
        {playlistTracks.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i + 1} queue={playlistTracks} />
        ))}
      </div>
    </div>
  );
}
