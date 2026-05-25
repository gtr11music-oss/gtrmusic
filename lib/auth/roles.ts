import type { UserRole } from "@/types";
import type { AppRole } from "@/types/database";

/** Maps legacy UI roles to Supabase canonical roles (Task 12) */
export function toAppRole(role: UserRole | AppRole): AppRole {
  if (role === "verified_artist") return "artist";
  if (role === "admin" || role === "artist" || role === "support" || role === "user")
    return role;
  return "user";
}

export function canAccessAdmin(role: UserRole | AppRole) {
  return toAppRole(role as UserRole) === "admin";
}

export function canAccessSupport(role: UserRole | AppRole) {
  const r = toAppRole(role as UserRole);
  return r === "support" || r === "admin";
}

export function canUploadContent(role: UserRole | AppRole) {
  const r = toAppRole(role as UserRole);
  return r === "artist" || r === "admin";
}

export function canMonetize(role: UserRole | AppRole, verified?: boolean) {
  const r = toAppRole(role as UserRole);
  return r === "artist" || r === "admin" || verified === true;
}

export const PROTECTED_ROUTES = {
  admin: ["/admin"],
  auth: ["/dashboard", "/upload", "/monetization", "/profile/edit"],
  artist: ["/upload", "/monetization"],
} as const;

export function isProtectedPath(path: string): boolean {
  return (
    path.startsWith("/admin") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/upload") ||
    path.startsWith("/monetization") ||
    path.startsWith("/profile/edit")
  );
}
