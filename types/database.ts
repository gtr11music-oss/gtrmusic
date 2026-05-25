/**
 * Supabase database types.
 * Task 2: profiles + app_role enum (manual types; regenerate after migrations):
 *   npx supabase gen types typescript --linked > types/database.ts
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

/** Placeholder Database shape — expanded in Tasks 2–6 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      songs: {
        Row: {
          id: string;
          artist_id: string;
          title: string;
          genre: string | null;
          audio_path: string;
          cover_path: string | null;
          duration_seconds: number | null;
          status: SongStatus;
          play_count: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["songs"]["Row"]> & {
          artist_id: string;
          title: string;
          audio_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["songs"]["Row"]>;
      };
      ad_stats: {
        Row: {
          id: string;
          page_path: string;
          visit_count: number;
          recorded_date: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ad_stats"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["ad_stats"]["Row"]>;
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          status: TicketStatus;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["support_tickets"]["Row"]> & {
          user_id: string;
          subject: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Row"]>;
      };
      artist_requests: {
        Row: {
          id: string;
          user_id: string;
          social_links: string[] | null;
          document_path: string | null;
          status: ArtistRequestStatus;
          admin_note: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["artist_requests"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["artist_requests"]["Row"]>;
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
        };
        Insert: Partial<Database["public"]["Tables"]["user_subscriptions"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_subscriptions"]["Row"]>;
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
    };
    Enums: {
      app_role: AppRole;
      song_status: SongStatus;
      ticket_status: TicketStatus;
    };
  };
}
