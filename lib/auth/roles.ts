import type { UserRole } from "@/types";

export function canAccessAdmin(role: UserRole) {
  return role === "admin";
}

export function canUploadContent(role: UserRole) {
  return role === "verified_artist" || role === "admin" || role === "user";
}

export function canMonetize(role: UserRole, verified?: boolean) {
  return role === "verified_artist" || role === "admin" || verified;
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
