import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT = 120;
const WINDOW_MS = 60_000;
const ipHits = new Map<string, { count: number; reset: number }>();

function getRateLimitKey(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

export function middleware(request: NextRequest) {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const bucket = ipHits.get(key);

  if (!bucket || now > bucket.reset) {
    ipHits.set(key, { count: 1, reset: now + WINDOW_MS });
  } else if (bucket.count >= RATE_LIMIT) {
    return new NextResponse("طلبات كثيرة — حاول لاحقاً", { status: 429 });
  } else {
    bucket.count += 1;
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
