"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { MonetizationDashboard } from "@/components/monetization/monetization-dashboard";

export default function MonetizationPage() {
  return (
    <RouteGuard requireAuth>
      <MonetizationDashboard />
    </RouteGuard>
  );
}
