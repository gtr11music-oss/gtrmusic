/**
 * Supabase database types (Tasks 2–10).
 * Regenerate: npx supabase gen types typescript --linked > types/database.ts
 */

export type AppRole = "admin" | "artist" | "support" | "user";
export type SongStatus = "pending" | "approved" | "rejected";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type ArtistRequestStatus = "pending" | "approved" | "rejected";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing";

export type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: AppRole;
  is_premium: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type SongRow = {
  id: string;
  artist_id: string;
  title: string;
  genre: string | null;
  description: string | null;
  audio_path: string;
  cover_path: string | null;
  duration_seconds: number | null;
  status: SongStatus;
  play_count: number;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    CompositeTypes: Record<string, never>;
    Tables: {
      profiles: {
        Row: ProfileRow;
        Relationships: [];
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          avatar_url?: string | null;
          role?: AppRole;
          is_premium?: boolean;
          email_verified?: boolean;
        };
        Update: {
          display_name?: string;
          avatar_url?: string | null;
          role?: AppRole;
          is_premium?: boolean;
          email_verified?: boolean;
        };
      };
      songs: {
        Row: SongRow;
        Relationships: [];
        Insert: {
          artist_id: string;
          title: string;
          audio_path: string;
          genre?: string | null;
          description?: string | null;
          cover_path?: string | null;
          duration_seconds?: number | null;
          status?: SongStatus;
        };
        Update: {
          title?: string;
          genre?: string | null;
          status?: SongStatus;
          play_count?: number;
        };
      };
      playlists: {
        Relationships: [];
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_path: string | null;
          owner_id: string | null;
          is_public: boolean;
          is_editorial: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          cover_path?: string | null;
          owner_id?: string | null;
          is_public?: boolean;
          is_editorial?: boolean;
          created_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          cover_path?: string | null;
          is_public?: boolean;
        };
      };
      playlist_songs: {
        Relationships: [];
        Row: {
          playlist_id: string;
          song_id: string;
          position: number;
          added_at: string;
        };
        Insert: {
          playlist_id: string;
          song_id: string;
          position?: number;
        };
        Update: { position?: number };
      };
      likes: {
        Relationships: [];
        Row: { user_id: string; song_id: string; created_at: string };
        Insert: { user_id: string; song_id: string };
        Update: Partial<{ user_id: string; song_id: string }>;
      };
      follows: {
        Relationships: [];
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: { follower_id: string; following_id: string };
        Update: Partial<{ follower_id: string; following_id: string }>;
      };
      artist_requests: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          social_links: string[] | null;
          document_path: string | null;
          status: ArtistRequestStatus;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          social_links?: string[] | null;
          document_path?: string | null;
        };
        Update: {
          status?: ArtistRequestStatus;
          admin_note?: string | null;
        };
      };
      support_tickets: {
        Relationships: [];
        Row: {
          id: string;
          user_id: string;
          subject: string;
          status: TicketStatus;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: { user_id: string; subject: string };
        Update: {
          status?: TicketStatus;
          assigned_to?: string | null;
        };
      };
      ticket_messages: {
        Relationships: [];
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          ticket_id: string;
          sender_id: string;
          body: string;
        };
        Update: Partial<{ body: string }>;
      };
      ad_stats: {
        Relationships: [];
        Row: {
          id: string;
          page_path: string;
          visit_count: number;
          recorded_date: string;
        };
        Insert: {
          page_path: string;
          visit_count?: number;
          recorded_date?: string;
        };
        Update: { visit_count?: number };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          external_id: string | null;
          status: SubscriptionStatus;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          provider?: string;
          external_id?: string | null;
          status?: SubscriptionStatus;
          current_period_end?: string | null;
        };
        Update: {
          status?: SubscriptionStatus;
          external_id?: string | null;
          current_period_end?: string | null;
        };
      };
      artist_payouts: {
        Relationships: [];
        Row: {
          id: string;
          artist_id: string;
          amount_cents: number;
          currency: string;
          mashreq_account_ref: string | null;
          mashreq_iban: string | null;
          status: string;
          requested_at: string;
          processed_at: string | null;
        };
        Insert: {
          artist_id: string;
          amount_cents: number;
          currency?: string;
          mashreq_account_ref?: string | null;
          mashreq_iban?: string | null;
        };
        Update: { status?: string; processed_at?: string | null };
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: { Args: Record<string, never>; Returns: unknown };
      handle_new_user: { Args: Record<string, never>; Returns: unknown };
      handle_user_email_verified: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_support_or_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      app_role: AppRole;
      song_status: SongStatus;
      ticket_status: TicketStatus;
      artist_request_status: ArtistRequestStatus;
      subscription_status: SubscriptionStatus;
    };
  };
}
