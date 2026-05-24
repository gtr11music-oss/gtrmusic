"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  return (
    <RouteGuard requireAuth requireAdmin>
      <AdminDashboard />
    </RouteGuard>
  );
}
