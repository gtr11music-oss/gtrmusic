export type MediaType = "music" | "podcast";

export type UserRole = "user" | "verified_artist" | "admin";

export type ReportType =
  | "stolen_music"
  | "fake_account"
  | "abuse"
  | "spam"
  | "copyright"
  | "other";

export type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";

export type PayoutMethod = "stripe" | "paypal";

export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

export type ContentStatus = "pending" | "processing" | "published" | "rejected";

export type UploadContentType = "music" | "podcast";

export interface Artist {
  id: string;
  name: string;
  image: string;
  followers?: number;
  totalStreams?: number;
  verified?: boolean;
  bio?: string;
  genres?: string[];
  userId?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  duration: number;
  cover: string;
  audioUrl: string;
  genre: string;
  plays: number;
  trending?: boolean;
  trendingScore?: number;
  uploadedAt?: string;
  uploadedBy?: string;
  status?: ContentStatus;
  aiTags?: string[];
}

export interface PodcastEpisode {
  id: string;
  title: string;
  showId: string;
  showName: string;
  host: string;
  description: string;
  duration: number;
  cover: string;
  audioUrl: string;
  publishedAt: string;
  plays: number;
  status?: ContentStatus;
  uploadedBy?: string;
}

export interface PodcastShow {
  id: string;
  title: string;
  host: string;
  description: string;
  cover: string;
  category: string;
  episodeCount: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  trackIds: string[];
  owner: string;
  ownerId?: string;
  isPublic: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinedAt: string;
  verified?: boolean;
  isPremium?: boolean;
  strikes?: number;
  bio?: string;
  socialLinks?: string[];
}

export interface UploadItem {
  id: string;
  type: UploadContentType;
  title: string;
  artist: string;
  genre: string;
  description?: string;
  status: ContentStatus;
  uploadedAt: string;
  cover?: string;
  uploadedBy?: string;
  uploadedByName?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTracks: number;
  totalPodcasts: number;
  pendingUploads: number;
  dailyPlays: number;
  totalRevenue?: number;
  adImpressions?: number;
  premiumSubscribers?: number;
}

export interface Comment {
  id: string;
  trackId: string;
  userId: string;
  userName: string;
  userVerified?: boolean;
  text: string;
  createdAt: string;
}

export interface Report {
  id: string;
  type: ReportType;
  targetType: "track" | "user" | "comment" | "podcast";
  targetId: string;
  targetLabel: string;
  reporterId: string;
  reporterName: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  strikesIssued?: number;
}

export interface CopyrightStrike {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  trackId?: string;
  createdAt: string;
  active: boolean;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  method: PayoutMethod;
  accountEmail: string;
  status: PayoutStatus;
  requestedAt: string;
}

export interface MonthlyAnalytics {
  month: string;
  streams: number;
  listenHours: number;
  revenue: number;
  followers: number;
}

export interface CreatorEarnings {
  totalStreams: number;
  totalFollowers: number;
  listenHours: number;
  estimatedRevenue: number;
  availableBalance: number;
  pendingPayout: number;
  monthly: MonthlyAnalytics[];
  eligible: boolean;
}

export interface ListeningEvent {
  trackId: string;
  artistId: string;
  genre: string;
  listenedSeconds: number;
  completedAt: string;
}

export interface AdSlot {
  id: string;
  placement: "sidebar" | "banner" | "in-feed" | "player";
  label: string;
}

export interface PremiumPlan {
  id: string;
  name: string;
  priceMonthly: number;
  features: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "system" | "follow" | "comment" | "moderation" | "verification" | "revenue";
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userVerified?: boolean;
  text: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  documentName?: string;
  socialLinks: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
}
