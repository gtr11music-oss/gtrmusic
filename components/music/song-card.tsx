"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Track } from "@/types";
import { usePlayerStore } from "@/lib/store/player-store";
import { cn } from "@/lib/utils";

interface SongCardProps {
  track: Track;
  queue?: Track[];
  className?: string;
}

export function SongCard({ track, queue, className }: SongCardProps) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const current = usePlayerStore((s) => s.queue[s.currentIndex]);
  const isActive =
    current?.type === "music" && current.track.id === track.id;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => playTrack(track, queue)}
      className={cn(
        "group relative w-full overflow-hidden rounded-lg bg-gtr-surface text-start transition-colors hover:bg-gtr-surface-hover",
        className
      )}
    >
      <div className="relative aspect-square">
        <Image
          src={track.cover}
          alt={track.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 200px"
          loading="lazy"
        />
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
            isActive && "opacity-100"
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-primary shadow-lg">
            <Play className="size-5 fill-white text-white ms-0.5" />
          </span>
        </div>
      </div>
      <div className="p-3">
        <Link
          href={`/track/${track.id}`}
          onClick={(e) => e.stopPropagation()}
          className="truncate font-semibold text-sm hover:text-primary hover:underline"
        >
          {track.title}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
      </div>
    </motion.button>
  );
}
