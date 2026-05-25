"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { TrackRow } from "@/components/music/track-row";
import { SongCard } from "@/components/music/song-card";
import { ar } from "@/lib/i18n/ar";
import { usePublicCatalog } from "@/hooks/use-public-catalog";

export default function TrendingPage() {
  const catalog = usePublicCatalog();
  const trending = catalog.smartTrending();

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-orange-500/20">
          <Flame className="size-6 text-orange-400" />
        </span>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{ar.nav.trending}</h1>
          <p className="text-sm text-muted-foreground">
            ترتيب ذكي — يشمل المحتوى المعتمد من الرفع
          </p>
        </div>
      </motion.div>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {trending.map((track) => (
          <SongCard key={track.id} track={track} queue={trending} />
        ))}
      </div>

      <div className="rounded-xl bg-gtr-surface/50 p-2">
        {trending.map((track, i) => (
          <TrackRow
            key={track.id}
            track={track}
            index={i + 1}
            queue={trending}
            showTrending
          />
        ))}
      </div>
    </div>
  );
}
