import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/api-guard";

/** Task 15 — admin approve/reject */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(["admin"]);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const status = body.status as "approved" | "rejected";

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("songs")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ song: data });
}
