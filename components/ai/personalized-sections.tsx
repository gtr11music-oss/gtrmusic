"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Brain } from "lucide-react";
import { SectionRow } from "@/components/music/section-row";
import { SongCard } from "@/components/music/song-card";
import { getPersonalizedHomeSections } from "@/lib/ai/recommendations";
import { useHistoryStore } from "@/lib/store/history-store";
import { classifyTrack } from "@/lib/ai/recommendations";

export function PersonalizedSections() {
  const events = useHistoryStore((s) => s.events);
  const { forYou, becauseYouListened, smartTrending, suggestedArtists } =
    getPersonalizedHomeSections(events);

  return (
    <>
      <section className="mb-6 px-4 md:px-8">
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <Brain className="size-5 text-primary" />
          <p className="text-sm">
            توصيات ذكية مبنية على سجل استماعك وتصنيف AI للأنواع
          </p>
        </div>
      </section>

      <SectionRow title="مخصص لك" href="/search">
        {forYou.map((track) => (
          <div key={track.id} className="w-40 shrink-0 md:w-48">
            <SongCard track={track} queue={forYou} />
            <div className="mt-1 flex flex-wrap gap-1 px-1">
              {classifyTrack(track).slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gtr-surface px-2 py-0.5 text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </SectionRow>

      {becauseYouListened.length > 0 && (
        <SectionRow title="لأنك استمعت إلى..." href="/library">
          {becauseYouListened.map((track) => (
            <div key={track.id} className="w-40 shrink-0 md:w-48">
              <SongCard track={track} queue={becauseYouListened} />
            </div>
          ))}
        </SectionRow>
      )}

      <SectionRow title="رائج ذكي (AI)" href="/trending">
        {smartTrending.map((track) => (
          <div key={track.id} className="w-40 shrink-0 md:w-48">
            <SongCard track={track} queue={smartTrending} />
          </div>
        ))}
      </SectionRow>

      <section className="mb-10 px-4 md:px-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Sparkles className="size-5 text-primary" />
          فنانون مقترحون
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {suggestedArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}`}
              className="flex w-28 shrink-0 flex-col items-center gap-2"
            >
              <div className="relative size-24 overflow-hidden rounded-full">
                <Image src={artist.image} alt={artist.name} fill className="object-cover" sizes="96px" loading="lazy" />
              </div>
              <p className="truncate text-center text-sm font-medium">{artist.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
