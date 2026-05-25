import type { User, UserRole } from "@/types";
import type { AppRole } from "@/types/database";
import type { ProfileRow } from "@/types/database";

export function appRoleToUserRole(role: AppRole): UserRole {
  if (role === "admin") return "admin";
  if (role === "artist") return "verified_artist";
  return "user";
}

export function profileToUser(profile: ProfileRow): User {
  const role = appRoleToUserRole(profile.role);
  return {
    id: profile.id,
    email: profile.email,
    name: profile.display_name || profile.email.split("@")[0] || "مستخدم",
    avatar: profile.avatar_url ?? "/avatars/default.png",
    role,
    verified: profile.role === "artist" || profile.role === "admin",
    bio: "",
    joinedAt: profile.created_at,
    isPremium: profile.is_premium,
  };
}
