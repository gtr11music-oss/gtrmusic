"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Users, Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { platformRevenueMock, buildMonthlyAnalytics } from "@/lib/data/analytics";
import { useSupabaseAuth } from "@/lib/auth/client-auth";

type AdminStats = {
  users_count: number;
  pending_songs: number;
  premium_subscribers: number;
  ad_visits_today: number;
  projected_ad_egp: number;
};

export function AdminRevenueTab() {
  const useSupabase = useSupabaseAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const monthly = buildMonthlyAnalytics(2_000_000);

  useEffect(() => {
    if (!useSupabase) return;
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((j) => {
        if (j.users_count !== undefined) setStats(j);
      });
  }, [useSupabase]);

  const cards = stats
    ? [
        { label: "المستخدمون", value: String(stats.users_count), icon: Users },
        { label: "أغاني معلقة", value: String(stats.pending_songs), icon: Music },
        { label: "مشتركو Premium", value: String(stats.premium_subscribers), icon: Users },
        {
          label: "إيراد إعلانات اليوم (تقدير)",
          value: `${stats.projected_ad_egp.toFixed(2)} ج.م`,
          icon: TrendingUp,
        },
      ]
    : [
        {
          label: "إجمالي الإيرادات",
          value: `$${platformRevenueMock.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
        },
        {
          label: "إيرادات الإعلانات",
          value: `$${platformRevenueMock.adRevenue.toLocaleString()}`,
          icon: TrendingUp,
        },
        {
          label: "اشتراكات Premium",
          value: `$${platformRevenueMock.premiumRevenue.toLocaleString()}`,
          icon: Users,
        },
        {
          label: "زيارات إعلانات اليوم",
          value: "—",
          icon: TrendingUp,
        },
      ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>مراقبة الإيرادات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={monthly} />
        </CardContent>
      </Card>
    </div>
  );
}
