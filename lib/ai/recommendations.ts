import type { Artist, Track } from "@/types";
import type { ListeningEvent } from "@/types";
import { tracks, artists, getTrendingTracks } from "@/lib/data/mock";

/** تصنيف ذكي بالنوع والكلمات المفتاحية */
export function classifyTrack(track: Track): string[] {
  const tags = [track.genre];
  const title = track.title.toLowerCase();
  if (/حب|قلب|عشق/.test(title)) tags.push("رومانسي");
  if (/رقص|إيقاع|مارحبا/.test(title)) tags.push("حيوي");
  if (/ليل|هادئ|شرق/.test(title)) tags.push("هادئ");
  return [...new Set(tags)];
}

/** درجة الرواج الذكية */
export function computeTrendingScore(track: Track): number {
  const recency =
    track.uploadedAt
      ? Math.max(0, 1 - (Date.now() - new Date(track.uploadedAt).getTime()) / 1e10)
      : 0.5;
  return track.plays * 0.7 + (track.trending ? 50_000 : 0) + recency * 20_000;
}

export function getSmartTrending(source: Track[] = tracks): Track[] {
  return [...source]
    .map((t) => ({ ...t, trendingScore: computeTrendingScore(t) }))
    .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0));
}

function genreAffinity(history: ListeningEvent[], genre: string): number {
  const total = history.reduce((s, e) => s + e.listenedSeconds, 0) || 1;
  const genreTime = history
    .filter((e) => e.genre === genre)
    .reduce((s, e) => s + e.listenedSeconds, 0);
  return genreTime / total;
}

function artistAffinity(history: ListeningEvent[], artistId: string): number {
  return history.filter((e) => e.artistId === artistId).length;
}

/** توصيات مشابهة بناءً على النوع والفنان */
export function getSimilarTracks(track: Track, limit = 6, pool: Track[] = tracks): Track[] {
  const tags = classifyTrack(track);
  return pool
    .filter((t) => t.id !== track.id)
    .map((t) => {
      let score = 0;
      if (t.genre === track.genre) score += 3;
      if (t.artistId === track.artistId) score += 5;
      const tTags = classifyTrack(t);
      score += tags.filter((tag) => tTags.includes(tag)).length * 2;
      return { track: t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.track);
}

/** توصيات شخصية من سجل الاستماع */
export function getPersonalizedTracks(
  history: ListeningEvent[],
  limit = 8,
  pool: Track[] = tracks
): Track[] {
  if (history.length === 0) {
    return getTrendingTracks().slice(0, limit);
  }

  const listened = new Set(history.map((h) => h.trackId));
  return pool
    .filter((t) => !listened.has(t.id))
    .map((t) => {
      let score = genreAffinity(history, t.genre) * 10;
      score += artistAffinity(history, t.artistId) * 3;
      score += Math.log10(t.plays + 1);
      return { track: t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.track);
}

/** فنانون مقترحون */
export function getSuggestedArtists(
  history: ListeningEvent[],
  limit = 6
): Artist[] {
  const followedGenres = new Map<string, number>();
  history.forEach((e) => {
    followedGenres.set(e.genre, (followedGenres.get(e.genre) ?? 0) + 1);
  });

  const topGenre = [...followedGenres.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  return artists
    .map((a) => {
      let score = a.followers ?? 0;
      if (topGenre && a.genres?.includes(topGenre)) score += 100_000;
      return { artist: a, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.artist);
}

/** أقسام الصفحة الرئيسية المخصصة */
export function getPersonalizedHomeSections(
  history: ListeningEvent[],
  pool: Track[] = tracks
) {
  const forYou = getPersonalizedTracks(history, 6, pool);
  const becauseYouListened =
    history.length > 0
      ? getSimilarTracks(
          pool.find((t) => t.id === history[0].trackId) ?? pool[0],
          6,
          pool
        )
      : forYou;
  const smartTrending = getSmartTrending(pool).slice(0, 6);
  const suggestedArtists = getSuggestedArtists(history, 6);

  return { forYou, becauseYouListened, smartTrending, suggestedArtists };
}
