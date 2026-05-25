import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/api-guard";

/** Task 13 — update own display_name + avatar_url */
export async function PATCH(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const body = await request.json();
  const display_name =
    typeof body.display_name === "string" ? body.display_name.trim() : undefined;
  const avatar_url =
    typeof body.avatar_url === "string" ? body.avatar_url.trim() : undefined;

  if (!display_name && avatar_url === undefined) {
    return NextResponse.json({ error: "لا توجد بيانات للتحديث" }, { status: 400 });
  }

  const supabase = await createClient();
  const updates: Record<string, string> = {};
  if (display_name) updates.display_name = display_name;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", auth.userId!)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ profile: data });
}
