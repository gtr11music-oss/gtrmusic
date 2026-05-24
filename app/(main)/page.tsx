"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeroBanner } from "@/components/music/hero-banner";
import { SectionRow } from "@/components/music/section-row";
import { SongCard } from "@/components/music/song-card";
import { PlaylistCard } from "@/components/music/playlist-card";
import { TrackRow } from "@/components/music/track-row";
import { PodcastCard } from "@/components/podcast/podcast-card";
import { PersonalizedSections } from "@/components/ai/personalized-sections";
import { AdSlot } from "@/components/ads/ad-slot";
import { SponsorBanner } from "@/components/ads/sponsor-banner";
import { ar } from "@/lib/i18n/ar";
import {
  artists,
  tracks,
  playlists,
  podcastEpisodes,
} from "@/lib/data/mock";
import { getSmartTrending } from "@/lib/ai/recommendations";

export default function HomePage() {
  const trending = getSmartTrending().slice(0, 6);

  return (
    <div className="pb-4">
      <HeroBanner />

      <PersonalizedSections />

      <div className="mb-8 px-4 md:px-8">
        <AdSlot placement="banner" />
      </div>

      <SponsorBanner className="mx-4 mb-8 md:mx-8" />

      <SectionRow title={ar.home.trending} href="/trending">
        {trending.map((track) => (
          <div key={track.id} className="w-40 shrink-0 md:w-48">
            <SongCard track={track} queue={trending} />
          </div>
        ))}
      </SectionRow>

      <SectionRow title={ar.home.newReleases}>
        {tracks.slice(0, 6).map((track) => (
          <div key={track.id} className="w-40 shrink-0 md:w-48">
            <SongCard track={track} queue={tracks} />
          </div>
        ))}
      </SectionRow>

      <SectionRow title={ar.home.featuredPlaylists} href="/playlists">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="w-40 shrink-0 md:w-48">
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </SectionRow>

      <section className="mb-10 px-4 md:px-8">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">{ar.home.recommended}</h2>
        <div className="rounded-xl bg-gtr-surface/50 p-2">
          {tracks.slice(0, 5).map((track, i) => (
            <TrackRow key={track.id} track={track} index={i + 1} queue={tracks} />
          ))}
        </div>
      </section>

      <SectionRow title={ar.home.topArtists}>
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}`}
            className="flex w-32 shrink-0 flex-col items-center gap-2 md:w-36"
          >
            <motion.div whileHover={{ scale: 1.02 }} className="w-full">
              <div className="relative mx-auto size-28 overflow-hidden rounded-full md:size-32">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                  loading="lazy"
                />
              </div>
              <p className="truncate text-center text-sm font-medium">{artist.name}</p>
            </motion.div>
          </Link>
        ))}
      </SectionRow>

      <SectionRow title={ar.home.podcastPicks} href="/podcasts">
        {podcastEpisodes.map((ep) => (
          <PodcastCard key={ep.id} episode={ep} queue={podcastEpisodes} />
        ))}
      </SectionRow>
    </div>
  );
}
