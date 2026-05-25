"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/search/search-bar";
import { TrackRow } from "@/components/music/track-row";
import { PodcastCard } from "@/components/podcast/podcast-card";
import { ar } from "@/lib/i18n/ar";
import { usePublicCatalog } from "@/hooks/use-public-catalog";
import { useSupabaseSearch } from "@/hooks/use-supabase-search";
import { isSupabaseConfigured } from "@/lib/env";
import Image from "next/image";

function SearchContent() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const catalog = usePublicCatalog();
  const remote = useSupabaseSearch(q);
  const local = catalog.searchAll(q);

  const results = isSupabaseConfigured() && q
    ? {
        tracks: [...local.tracks, ...remote.tracks.filter((t) => !local.tracks.some((l) => l.id === t.id))],
        artists: [...local.artists, ...remote.artists.filter((a) => !local.artists.some((l) => l.id === a.id))],
        podcasts: local.podcasts,
      }
    : local;

  const hasResults =
    results.tracks.length > 0 ||
    results.artists.length > 0 ||
    results.podcasts.length > 0;

  return (
    <div className="p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 text-2xl font-bold md:text-3xl"
      >
        {ar.search.results}
      </motion.h1>

      <div className="mb-8 max-w-xl">
        <SearchBar defaultValue={q} />
      </div>

      {!q && <p className="text-muted-foreground">{ar.search.placeholder}</p>}

      {q && !hasResults && (
        <p className="text-muted-foreground">{ar.search.noResults}</p>
      )}

      {results.tracks.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{ar.search.songs}</h2>
          <div className="rounded-xl bg-gtr-surface/50 p-2">
            {results.tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i + 1} queue={results.tracks} />
            ))}
          </div>
        </section>
      )}

      {results.artists.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{ar.search.artists}</h2>
          <div className="flex flex-wrap gap-6">
            {results.artists.map((artist) => (
              <div key={artist.id} className="flex flex-col items-center gap-2">
                <div className="relative size-20 overflow-hidden rounded-full">
                  <Image src={artist.image} alt={artist.name} fill className="object-cover" sizes="80px" />
                </div>
                <p className="text-sm font-medium">{artist.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {results.podcasts.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">{ar.search.podcasts}</h2>
          <div className="flex flex-wrap gap-4">
            {results.podcasts.map((ep) => (
              <PodcastCard key={ep.id} episode={ep} queue={results.podcasts} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">جاري التحميل...</div>}>
      <SearchContent />
    </Suspense>
  );
}
