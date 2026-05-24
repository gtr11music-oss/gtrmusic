"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { canAccessAdmin } from "@/lib/auth/roles";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function RouteGuard({
  children,
  requireAuth,
  requireAdmin,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (requireAdmin && (!user || !canAccessAdmin(user.role))) {
      router.replace("/dashboard");
    }
  }, [requireAuth, requireAdmin, isAuthenticated, user, router, pathname]);

  if (requireAuth && !isAuthenticated) return null;
  if (requireAdmin && (!user || !canAccessAdmin(user.role))) return null;

  return <>{children}</>;
}
