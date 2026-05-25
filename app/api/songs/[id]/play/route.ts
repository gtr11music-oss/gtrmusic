import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServiceRoleKey, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** Signed playback URL for approved songs */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured() || !getServiceRoleKey()) {
    return NextResponse.json({ error: "غير متاح" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: song } = await supabase
    .from("songs")
    .select("audio_path, status")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();

  if (!song) {
    return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("audio")
    .createSignedUrl(song.audio_path, 3600);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "فشل" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
