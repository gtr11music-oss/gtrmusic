import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/api-guard";

/** Task 20 — premium gate for downloads */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ songId: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  if (!auth.profile!.is_premium) {
    return NextResponse.json(
      { error: "التحميل متاح لمشتركي Premium فقط" },
      { status: 403 }
    );
  }

  const { songId } = await params;
  const supabase = await createClient();

  const { data: song, error } = await supabase
    .from("songs")
    .select("audio_path, status")
    .eq("id", songId)
    .eq("status", "approved")
    .single();

  if (error || !song) {
    return NextResponse.json({ error: "الأغنية غير متاحة" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("audio")
    .createSignedUrl(song.audio_path, 3600);

  if (signError || !signed) {
    return NextResponse.json({ error: signError?.message ?? "فشل التوقيع" }, {
      status: 500,
    });
  }

  return NextResponse.json({ url: signed.signedUrl });
}
