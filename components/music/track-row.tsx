"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, TrendingUp } from "lucide-react";
import { LikeButton } from "@/components/community/like-button";
import { ShareButton } from "@/components/community/share-button";
import type { Track } from "@/types";
import { usePlayerStore } from "@/lib/store/player-store";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TrackRowProps {
  track: Track;
  index?: number;
  queue?: Track[];
  showTrending?: boolean;
}

export function TrackRow({ track, index, queue, showTrending }: TrackRowProps) {
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const current = usePlayerStore((s) => s.queue[s.currentIndex]);
  const isActive =
    current?.type === "music" && current.track.id === track.id;

  const handlePlay = () => {
    if (isActive) togglePlay();
    else playTrack(track, queue);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-gtr-surface/80",
        isActive && "bg-primary/10"
      )}
    >
      {index !== undefined && (
        <span className="w-6 text-center text-sm text-muted-foreground group-hover:hidden">
          {index}
        </span>
      )}
      <button
        type="button"
        onClick={handlePlay}
        className={cn(
          "hidden size-8 items-center justify-center rounded-full bg-primary text-primary-foreground group-hover:flex",
          index !== undefined && "group-hover:flex"
        )}
      >
        {isActive && isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4 fill-current ms-0.5" />
        )}
      </button>
      <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
        <Image src={track.cover} alt={track.title} fill className="object-cover" sizes="40px" loading="lazy" />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/track/${track.id}`}
          className={cn("truncate font-medium text-sm hover:underline", isActive && "text-primary")}
        >
          {track.title}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
      </div>
      {showTrending && track.trending && (
        <TrendingUp className="size-4 shrink-0 text-gtr-accent" />
      )}
      <LikeButton trackId={track.id} />
      <ShareButton trackId={track.id} />
      <span className="text-xs text-muted-foreground tabular-nums">
        {formatDuration(track.duration)}
      </span>
    </div>
  );
}
