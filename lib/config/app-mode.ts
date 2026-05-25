import { isSupabaseConfigured, getServiceRoleKey } from "@/lib/env";

/** Production deploy: set NEXT_PUBLIC_APP_MODE=production on Vercel */
export function isProductionApp(): boolean {
  return (
    process.env.NEXT_PUBLIC_APP_MODE === "production" ||
    process.env.NODE_ENV === "production"
  );
}

/** Demo login / mock catalog only in local dev without production flag */
export function isDemoModeAllowed(): boolean {
  if (isProductionApp()) return false;
  return process.env.NEXT_PUBLIC_ALLOW_DEMO_MODE === "true";
}

export function requiresSupabase(): boolean {
  return isProductionApp() || isSupabaseConfigured();
}

export function isServerFullyConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(getServiceRoleKey());
}
