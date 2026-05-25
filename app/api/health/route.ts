import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, getPublicSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Task 1 — Health check for deployment & local verification.
 * GET /api/health
 */
export async function GET() {
  const checks: Record<string, string> = {
    app: "ok",
    supabase_configured: isSupabaseConfigured() ? "yes" : "no",
    supabase_connection: "skipped",
  };

  if (isSupabaseConfigured()) {
    try {
      const { url, anonKey } = getPublicSupabaseConfig();
      const supabase = createClient(url, anonKey);
      const { error: profilesErr } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);
      const { error: songsErr } = await supabase
        .from("songs")
        .select("id")
        .limit(1);

      if (profilesErr?.code === "42P01") {
        checks.supabase_connection =
          "connected (profiles missing — run Task 2 migration)";
      } else if (songsErr?.code === "42P01") {
        checks.supabase_connection =
          "connected (run RUN_TASKS_3_TO_10.sql in Supabase)";
      } else if (profilesErr || songsErr) {
        checks.supabase_connection = `error: ${profilesErr?.message ?? songsErr?.message}`;
      } else {
        checks.supabase_connection = "connected";
      }
    } catch (e) {
      checks.supabase_connection =
        e instanceof Error ? e.message : "connection failed";
    }
  }

  const healthy =
    checks.app === "ok" &&
    (checks.supabase_configured === "no" ||
      checks.supabase_connection.startsWith("connected"));

  return NextResponse.json(
    {
      service: "gtrmusic",
      status: healthy ? "healthy" : "degraded",
      checks,
      roadmap_task: 10,
    },
    { status: healthy ? 200 : 503 }
  );
}
