import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AppRole } from "@/types/database";

const ADMIN_PREFIX = "/admin";
const ARTIST_PREFIXES = ["/upload", "/monetization"];
const AUTH_REQUIRED = ["/dashboard", "/upload", "/monetization", "/profile/edit", "/notifications"];

function redirectLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function redirectHome(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

export function enforceRbac(
  request: NextRequest,
  role: AppRole | null,
  isAuthenticated: boolean
): NextResponse | null {
  const path = request.nextUrl.pathname;

  if (AUTH_REQUIRED.some((p) => path.startsWith(p)) && !isAuthenticated) {
    return redirectLogin(request);
  }

  if (path.startsWith(ADMIN_PREFIX)) {
    if (!isAuthenticated) return redirectLogin(request);
    if (role !== "admin") return redirectHome(request);
  }

  if (ARTIST_PREFIXES.some((p) => path.startsWith(p))) {
    if (!isAuthenticated) return redirectLogin(request);
    if (role !== "artist" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return null;
}
