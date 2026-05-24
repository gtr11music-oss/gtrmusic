"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackRow } from "@/components/music/track-row";
import { FollowButton } from "@/components/community/follow-button";
import { ReportDialog } from "@/components/moderation/report-dialog";
import { AdSlot } from "@/components/ads/ad-slot";
import { getArtistById, getTracksByArtist } from "@/lib/data/mock";
import { usePlayerStore } from "@/lib/store/player-store";

export default function ArtistPage() {
  const params = useParams();
  const artist = getArtistById(params.id as string);
  const playTrack = usePlayerStore((s) => s.playTrack);

  if (!artist) {
    return (
      <div className="p-16 text-center text-muted-foreground">
        الفنان غير موجود — <Link href="/" className="text-primary">الرئيسية</Link>
      </div>
    );
  }

  const artistTracks = getTracksByArtist(artist.id);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative size-40 overflow-hidden rounded-full sm:size-48">
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover"
            sizes="192px"
            priority
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">فنان</p>
          <h1 className="flex items-center gap-2 text-3xl font-bold md:text-4xl">
            {artist.name}
            {artist.verified && <BadgeCheck className="size-7 text-primary" />}
          </h1>
          {artist.bio && <p className="mt-2 text-muted-foreground">{artist.bio}</p>}
          <p className="mt-2 text-sm">
            {(artist.followers ?? 0).toLocaleString("ar-EG")} متابع •{" "}
            {(artist.totalStreams ?? 0).toLocaleString("ar-EG")} تشغيل
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <FollowButton artistId={artist.id} />
            <Button
              className="bg-gtr-accent text-black"
              onClick={() => artistTracks[0] && playTrack(artistTracks[0], artistTracks)}
            >
              تشغيل
            </Button>
            <ReportDialog targetType="user" targetId={artist.id} targetLabel={artist.name} />
          </div>
        </div>
      </div>

      <AdSlot placement="banner" className="mb-8" />

      <h2 className="mb-4 text-xl font-bold">الأغاني الشائعة</h2>
      <div className="rounded-xl bg-gtr-surface/50 p-2">
        {artistTracks.map((track, i) => (
          <TrackRow key={track.id} track={track} index={i + 1} queue={artistTracks} />
        ))}
      </div>
    </div>
  );
}
