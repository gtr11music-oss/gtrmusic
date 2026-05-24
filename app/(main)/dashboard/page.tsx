"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { ArtistDashboard } from "@/components/artist/artist-dashboard";

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth>
      <ArtistDashboard />
    </RouteGuard>
  );
}
