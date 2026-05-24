import type {
  AdminStats,
  Artist,
  Playlist,
  PodcastEpisode,
  PodcastShow,
  Track,
  UploadItem,
  User,
} from "@/types";

const cover = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/400`;

const demoAudio =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const artists: Artist[] = [
  { id: "a1", name: "عبد المجيد عبدالله", image: cover("abdulmajeed"), followers: 2_400_000, totalStreams: 45_000_000, verified: true, bio: "فنان خليجي أسطوري", genres: ["خليجي"] },
  { id: "a2", name: "أصالة نصري", image: cover("asala"), followers: 3_100_000, totalStreams: 62_000_000, verified: true, bio: "صوت مصر والعرب", genres: ["مصري", "عربي"] },
  { id: "a3", name: "محمد عبده", image: cover("mohammed"), followers: 1_800_000, totalStreams: 38_000_000, verified: true, bio: "فنان العرب", genres: ["خليجي"] },
  { id: "a4", name: "إليسا", image: cover("elissa"), followers: 4_200_000, totalStreams: 88_000_000, verified: true, bio: "ملكة المسرح اللبنانية", genres: ["لبناني", "بوب"] },
  { id: "a5", name: "راشد الماجد", image: cover("rashed"), followers: 1_500_000, totalStreams: 28_000_000, verified: true, bio: "نجم الخليج", genres: ["خليجي"] },
  { id: "a6", name: "بلقيس", image: cover("balqees"), followers: 980_000, totalStreams: 15_000_000, verified: false, bio: "فنانة يمنية-إماراتية", genres: ["خليجي", "بوب"] },
];

export function getArtistById(id: string) {
  return artists.find((a) => a.id === id);
}

export function getTracksByArtist(artistId: string) {
  return tracks.filter((t) => t.artistId === artistId);
}

export const tracks: Track[] = [
  {
    id: "t1",
    title: "يا هوى",
    artist: "عبد المجيد عبدالله",
    artistId: "a1",
    album: "حبيبي",
    duration: 245,
    cover: cover("yahawa"),
    audioUrl: demoAudio,
    genre: "خليجي",
    plays: 1_240_000,
    trending: true,
  },
  {
    id: "t2",
    title: "بنت أكابر",
    artist: "أصالة نصري",
    artistId: "a2",
    album: "أصالة 2024",
    duration: 198,
    cover: cover("bentakaber"),
    audioUrl: demoAudio,
    genre: "مصري",
    plays: 2_100_000,
    trending: true,
  },
  {
    id: "t3",
    title: "أبشر",
    artist: "محمد عبده",
    artistId: "a3",
    album: "كلاسيك",
    duration: 312,
    cover: cover("abshar"),
    audioUrl: demoAudio,
    genre: "خليجي",
    plays: 890_000,
    trending: true,
  },
  {
    id: "t4",
    title: "على بالي",
    artist: "إليسا",
    artistId: "a4",
    album: "إليسا",
    duration: 221,
    cover: cover("alabali"),
    audioUrl: demoAudio,
    genre: "لبناني",
    plays: 3_400_000,
    trending: true,
  },
  {
    id: "t5",
    title: "مرحبا",
    artist: "راشد الماجد",
    artistId: "a5",
    album: "مرحبا",
    duration: 187,
    cover: cover("marhaba"),
    audioUrl: demoAudio,
    genre: "خليجي",
    plays: 760_000,
  },
  {
    id: "t6",
    title: "حبيبي يا",
    artist: "بلقيس",
    artistId: "a6",
    album: "حبيبي",
    duration: 203,
    cover: cover("habibi"),
    audioUrl: demoAudio,
    genre: "خليجي",
    plays: 540_000,
  },
  {
    id: "t7",
    title: "ليالي الشرق",
    artist: "عبد المجيد عبدالله",
    artistId: "a1",
    album: "شرق",
    duration: 256,
    cover: cover("layali"),
    audioUrl: demoAudio,
    genre: "خليجي",
    plays: 420_000,
  },
  {
    id: "t8",
    title: "قلبي اختار",
    artist: "أصالة نصري",
    artistId: "a2",
    album: "قلبي",
    duration: 234,
    cover: cover("qalbi"),
    audioUrl: demoAudio,
    genre: "مصري",
    plays: 1_100_000,
  },
];

export const playlists: Playlist[] = [
  {
    id: "p1",
    title: "أفضل الخليجي",
    description: "أجمل الأغاني الخليجية في مكان واحد",
    cover: cover("khaleeji"),
    trackIds: ["t1", "t3", "t5"],
    owner: "GTRmusic",
    isPublic: true,
    createdAt: "2025-01-15",
  },
  {
    id: "p2",
    title: "ليلة هادئة",
    description: "موسيقى هادئة للاسترخاء",
    cover: cover("chill"),
    trackIds: ["t4", "t6", "t8"],
    owner: "GTRmusic",
    isPublic: true,
    createdAt: "2025-02-01",
  },
  {
    id: "p3",
    title: "تمرين وطاقة",
    description: "إيقاعات عالية للرياضة",
    cover: cover("workout"),
    trackIds: ["t2", "t5", "t7"],
    owner: "GTRmusic",
    isPublic: true,
    createdAt: "2025-03-10",
  },
  {
    id: "p4",
    title: "مصر والشام",
    description: "من مصر إلى لبنان",
    cover: cover("masr"),
    trackIds: ["t2", "t4", "t8"],
    owner: "GTRmusic",
    isPublic: true,
    createdAt: "2025-04-20",
  },
];

export const podcastShows: PodcastShow[] = [
  {
    id: "ps1",
    title: "حكايات عربية",
    host: "سارة أحمد",
    description: "قصص من التراث العربي بصوت عصري",
    cover: cover("hikayat"),
    category: "ثقافة",
    episodeCount: 42,
  },
  {
    id: "ps2",
    title: "ريادة الأعمال",
    host: "خالد المنصور",
    description: "نصائح لرواد الأعمال في المنطقة",
    cover: cover("reyada"),
    category: "أعمال",
    episodeCount: 28,
  },
  {
    id: "ps3",
    title: "صحة وعافية",
    host: "د. نورة العتيبي",
    description: "نصائح صحية يومية بالعربية",
    cover: cover("sehha"),
    category: "صحة",
    episodeCount: 56,
  },
];

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "pe1",
    title: "ألف ليلة وليلة: البداية",
    showId: "ps1",
    showName: "حكايات عربية",
    host: "سارة أحمد",
    description: "نستكشف أول حكاية من المجموعة الأسطورية",
    duration: 1820,
    cover: cover("alf"),
    audioUrl: demoAudio,
    publishedAt: "2025-05-01",
    plays: 45_000,
  },
  {
    id: "pe2",
    title: "كيف تبني شركتك الناشئة",
    showId: "ps2",
    showName: "ريادة الأعمال",
    host: "خالد المنصور",
    description: "خطوات عملية لإطلاق مشروعك",
    duration: 2400,
    cover: cover("startup"),
    audioUrl: demoAudio,
    publishedAt: "2025-05-10",
    plays: 32_000,
  },
  {
    id: "pe3",
    title: "النوم الصحي في رمضان",
    showId: "ps3",
    showName: "صحة وعافية",
    host: "د. نورة العتيبي",
    description: "نصائح للنوم الجيد خلال شهر الصيام",
    duration: 1560,
    cover: cover("sleep"),
    audioUrl: demoAudio,
    publishedAt: "2025-05-15",
    plays: 28_000,
  },
  {
    id: "pe4",
    title: "سندباد البحار",
    showId: "ps1",
    showName: "حكايات عربية",
    host: "سارة أحمد",
    description: "مغامرة سندباد عبر البحار السبعة",
    duration: 2100,
    cover: cover("sindbad"),
    audioUrl: demoAudio,
    publishedAt: "2025-05-20",
    plays: 38_000,
  },
];

export const demoUser: User = {
  id: "u1",
  name: "مستخدم تجريبي",
  email: "demo@gtrmusic.com",
  avatar: cover("user"),
  role: "verified_artist",
  verified: true,
  joinedAt: "2024-06-01",
};

export const adminStats: AdminStats = {
  totalUsers: 12_450,
  totalTracks: 8_320,
  totalPodcasts: 156,
  pendingUploads: 7,
  dailyPlays: 245_000,
};

export const pendingUploads: UploadItem[] = [
  {
    id: "up1",
    type: "music",
    title: "أغنية جديدة",
    artist: "فنان مستقل",
    genre: "بوب",
    status: "pending",
    uploadedAt: "2025-05-22",
    cover: cover("new1"),
  },
  {
    id: "up2",
    type: "podcast",
    title: "حلقة بودكاست تجريبية",
    artist: "برنامج الصوت",
    genre: "بودكاست",
    status: "pending",
    uploadedAt: "2025-05-21",
    cover: cover("new2"),
    description: "حلقة تجريبية للمراجعة",
  },
  {
    id: "up3",
    type: "music",
    title: "رحلة",
    artist: "عمر خالد",
    genre: "راب",
    status: "processing",
    uploadedAt: "2025-05-20",
    cover: cover("new3"),
  },
];

export function getTrackById(id: string) {
  return tracks.find((t) => t.id === id);
}

export function getPlaylistById(id: string) {
  return playlists.find((p) => p.id === id);
}

export function getPlaylistTracks(playlist: Playlist) {
  return playlist.trackIds
    .map((id) => getTrackById(id))
    .filter((t): t is Track => Boolean(t));
}

export function getTrendingTracks() {
  return [...tracks]
    .filter((t) => t.trending)
    .sort((a, b) => b.plays - a.plays);
}

export function searchAll(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { tracks: [], artists: [], podcasts: [] };

  return {
    tracks: tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
    ),
    artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
    podcasts: podcastEpisodes.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.showName.toLowerCase().includes(q) ||
        p.host.toLowerCase().includes(q)
    ),
  };
}
