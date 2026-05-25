/**
 * Centralized environment access for GTRmusic.
 * Task 1 — do not read process.env directly in feature code; use these helpers.
 */

export type AppRole = "admin" | "artist" | "support" | "user";

const requiredPublic = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return { url, anonKey };
}

export function getServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://localhost:3000";
}

/** Validates public env at build/boot when strict mode is needed */
export function assertPublicEnv(): void {
  for (const key of requiredPublic) {
    if (!process.env[key]?.trim()) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

/** Production deploy checklist */
export function assertProductionEnv(): void {
  assertPublicEnv();
  if (!getServiceRoleKey()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required in production");
  }
  const site = getSiteUrl();
  if (site.includes("localhost")) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be your production domain");
  }
}
