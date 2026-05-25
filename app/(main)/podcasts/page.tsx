"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mic2 } from "lucide-react";
import { PodcastCard } from "@/components/podcast/podcast-card";
import { ar } from "@/lib/i18n/ar";
import { podcastShows } from "@/lib/data/mock";
import { usePublicCatalog } from "@/hooks/use-public-catalog";

export default function PodcastsPage() {
  const catalog = usePublicCatalog();

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex items-center gap-3"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-purple-500/20">
          <Mic2 className="size-6 text-purple-400" />
        </span>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{ar.nav.podcasts}</h1>
          <p className="text-sm text-muted-foreground">
            {catalog.podcasts.length} حلقة متاحة
          </p>
        </div>
      </motion.div>

      <h2 className="mb-4 text-lg font-semibold">البرامج</h2>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {podcastShows.map((show, i) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 rounded-xl bg-gtr-surface p-4"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
              <Image src={show.cover} alt={show.title} fill className="object-cover" sizes="80px" loading="lazy" />
            </div>
            <div>
              <p className="font-semibold">{show.title}</p>
              <p className="text-sm text-muted-foreground">{show.host}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {show.episodeCount} حلقة • {show.category}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">أحدث الحلقات</h2>
      <div className="flex flex-wrap gap-4">
        {catalog.podcasts.map((ep) => (
          <PodcastCard key={ep.id} episode={ep} queue={catalog.podcasts} />
        ))}
      </div>
    </div>
  );
}
