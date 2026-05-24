"use client";

import Image from "next/image";
import { Headphones } from "lucide-react";
import { motion } from "framer-motion";
import type { PodcastEpisode } from "@/types";
import { usePlayerStore } from "@/lib/store/player-store";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PodcastCardProps {
  episode: PodcastEpisode;
  queue?: PodcastEpisode[];
  className?: string;
}

export function PodcastCard({ episode, queue, className }: PodcastCardProps) {
  const playEpisode = usePlayerStore((s) => s.playEpisode);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      onClick={() => playEpisode(episode, queue)}
      className={cn(
        "group w-64 shrink-0 overflow-hidden rounded-lg bg-gtr-surface text-start transition-colors hover:bg-gtr-surface-hover",
        className
      )}
    >
      <div className="relative aspect-video">
        <Image src={episode.cover} alt={episode.title} fill className="object-cover" sizes="256px" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-purple-500">
            <Headphones className="size-5 text-white" />
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="truncate font-semibold text-sm">{episode.title}</p>
        <p className="truncate text-xs text-muted-foreground">{episode.showName}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDuration(episode.duration)}
        </p>
      </div>
    </motion.button>
  );
}
