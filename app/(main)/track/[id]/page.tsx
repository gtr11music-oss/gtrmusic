"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTrackById } from "@/lib/data/mock";
import { getSimilarTracks, classifyTrack } from "@/lib/ai/recommendations";
import { TrackRow } from "@/components/music/track-row";
import { SongCard } from "@/components/music/song-card";
import { LikeButton } from "@/components/community/like-button";
import { ShareButton } from "@/components/community/share-button";
import { CommentsPanel } from "@/components/community/comments-panel";
import { ReportDialog } from "@/components/moderation/report-dialog";
import { AdSlot } from "@/components/ads/ad-slot";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/lib/store/player-store";
import { Badge } from "@/components/ui/badge";

export default function TrackPage() {
  const params = useParams();
  const track = getTrackById(params.id as string);
  const playTrack = usePlayerStore((s) => s.playTrack);

  if (!track) {
    return (
      <div className="p-16 text-center">
        <p className="text-muted-foreground">الأغنية غير موجودة</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/">الرئيسية</Link>
        </Button>
      </div>
    );
  }

  const similar = getSimilarTracks(track);
  const tags = classifyTrack(track);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl shadow-2xl">
          <Image
            src={track.cover}
            alt={track.title}
            fill
            className="object-cover"
            sizes="280px"
            priority
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">أغنية</p>
          <h1 className="text-3xl font-bold">{track.title}</h1>
          <Link href={`/artist/${track.artistId}`} className="text-lg text-primary hover:underline">
            {track.artist}
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t} variant="secondary">
                AI: {t}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {track.plays.toLocaleString("ar-EG")} تشغيل • {track.genre}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button
              size="lg"
              className="gap-2 bg-gtr-accent text-black"
              onClick={() => playTrack(track, similar)}
            >
              <Play className="size-5 fill-current" />
              تشغيل
            </Button>
            <LikeButton trackId={track.id} />
            <ShareButton trackId={track.id} />
            <ReportDialog targetType="track" targetId={track.id} targetLabel={track.title} />
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <CommentsPanel trackId={track.id} />
        <AdSlot placement="in-feed" />
      </div>

      <h2 className="mb-4 text-xl font-bold">أغاني مشابهة (AI)</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {similar.map((t) => (
          <div key={t.id} className="w-40 shrink-0">
            <SongCard track={t} queue={similar} />
          </div>
        ))}
      </div>
    </div>
  );
}
