"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Mic2,
  Music2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { usePlayerStore, useCurrentItem } from "@/lib/store/player-store";
import { formatDuration } from "@/lib/utils";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";

export function NowPlayingBar() {
  const current = useCurrentItem();
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  const mediaType = usePlayerStore((s) => s.mediaType);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);

  if (!current) return null;

  const title =
    current.type === "music" ? current.track.title : current.episode.title;
  const subtitle =
    current.type === "music"
      ? current.track.artist
      : current.episode.showName;
  const cover =
    current.type === "music" ? current.track.cover : current.episode.cover;
  const isPodcast = current.type === "podcast";

  const handleSeek = (value: number[]) => {
    const t = value[0];
    setProgress(t);
    const audio = document.querySelector("audio");
    if (audio) audio.currentTime = t;
  };

  const handleVolume = (value: number[]) => setVolume(value[0] / 100);

  return (
    <AnimatePresence>
      <motion.footer
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-sidebar/95 backdrop-blur-xl"
      >
        <div className="px-2 py-2 md:px-4">
          <div className="mb-2 hidden md:block">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground tabular-nums">
              <span>{formatDuration(progress)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md md:size-14">
                <Image src={cover} alt={title} fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{title}</p>
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
                <span
                  className={cn(
                    "mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]",
                    isPodcast ? "bg-purple-500/20 text-purple-300" : "bg-gtr-accent/20 text-gtr-accent"
                  )}
                >
                  {isPodcast ? (
                    <>
                      <Mic2 className="size-3" /> {ar.player.podcast}
                    </>
                  ) : (
                    <>
                      <Music2 className="size-3" /> {ar.player.music}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleShuffle}
                className={cn(shuffle && "text-primary")}
              >
                <Shuffle className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={previous}>
                <SkipBack className="size-5" />
              </Button>
              <Button
                size="icon"
                className="size-10 rounded-full bg-primary hover:bg-primary/90"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5 fill-current ms-0.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={next}>
                <SkipForward className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={cycleRepeat}
                className={cn(repeat !== "off" && "text-primary")}
              >
                <Repeat className="size-4" />
                {repeat === "one" && (
                  <span className="absolute text-[8px] font-bold">1</span>
                )}
              </Button>
            </div>

            <div className="hidden items-center gap-2 md:flex md:w-32">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              >
                {volume === 0 ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolume}
                className="flex-1"
              />
            </div>
          </div>

          <div className="mt-2 md:hidden">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
          </div>
        </div>
      </motion.footer>
    </AnimatePresence>
  );
}
