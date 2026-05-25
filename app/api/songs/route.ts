import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status") ?? "approved";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  const supabase = await createClient();
  let query = supabase
    .from("songs")
    .select("*")
    .eq("status", status as "pending" | "approved" | "rejected")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ songs: data ?? [] });
}
