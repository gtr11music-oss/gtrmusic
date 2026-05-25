import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/server-session";
import type { AppRole } from "@/types/database";

export async function requireAuth() {
  const { userId, profile } = await getSessionProfile();
  if (!userId || !profile) {
    return {
      error: NextResponse.json({ error: "غير مصرح" }, { status: 401 }),
      userId: null,
      profile: null,
    };
  }
  return { error: null, userId, profile };
}

export async function requireRole(roles: AppRole[]) {
  const auth = await requireAuth();
  if (auth.error) return auth;
  if (!roles.includes(auth.profile!.role)) {
    return {
      ...auth,
      error: NextResponse.json({ error: "صلاحيات غير كافية" }, { status: 403 }),
    };
  }
  return auth;
}
