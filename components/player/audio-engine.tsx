"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/lib/store/player-store";
import { useHistoryStore } from "@/lib/store/history-store";
import { useMonetizationStore } from "@/lib/store/monetization-store";
import { applyStreamingOptimizations, prefetchAudio } from "@/lib/performance/audio-buffer";
import { resolveAudioUrl } from "@/lib/catalog/resolve-audio-url";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastRecorded = useRef(0);
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const next = usePlayerStore((s) => s.next);
  const recordListen = useHistoryStore((s) => s.recordListen);
  const incrementStreams = useMonetizationStore((s) => s.incrementStreams);

  const current = queue[currentIndex];
  const src =
    current?.type === "music"
      ? current.track.audioUrl
      : current?.type === "podcast"
        ? current.episode.audioUrl
        : undefined;

  const nextItem = queue[currentIndex + 1];
  const nextSrc =
    nextItem?.type === "music"
      ? nextItem.track.audioUrl
      : nextItem?.type === "podcast"
        ? nextItem.episode.audioUrl
        : undefined;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    applyStreamingOptimizations(audio);
  }, []);

  useEffect(() => {
    if (nextSrc) prefetchAudio(nextSrc);
  }, [nextSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    let cancelled = false;
    resolveAudioUrl(src).then((resolved) => {
      if (cancelled) return;
      audio.src = resolved;
      audio.load();
      if (isPlaying) void audio.play().catch(() => setPlaying(false));
    });
    return () => {
      cancelled = true;
    };
  }, [src, currentIndex, isPlaying, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) void audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
      if (
        current?.type === "music" &&
        audio.currentTime - lastRecorded.current >= 30
      ) {
        lastRecorded.current = audio.currentTime;
        recordListen({
          trackId: current.track.id,
          artistId: current.track.artistId,
          genre: current.track.genre,
          listenedSeconds: 30,
        });
        incrementStreams(1);
      }
    };
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (current?.type === "music") {
        recordListen({
          trackId: current.track.id,
          artistId: current.track.artistId,
          genre: current.track.genre,
          listenedSeconds: Math.round(audio.duration || 30),
        });
      }
      next();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setProgress, setDuration, next, current, recordListen, incrementStreams]);

  useEffect(() => {
    lastRecorded.current = 0;
  }, [currentIndex]);

  return <audio ref={audioRef} preload="metadata" className="hidden" />;
}
