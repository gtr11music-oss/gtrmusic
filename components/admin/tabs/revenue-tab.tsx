"use client";

import { DollarSign, TrendingUp, Users, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { platformRevenueMock, buildMonthlyAnalytics } from "@/lib/data/analytics";

export function AdminRevenueTab() {
  const monthly = buildMonthlyAnalytics(2_000_000);

  const stats = [
    { label: "إجمالي الإيرادات", value: `$${platformRevenueMock.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "إيرادات الإعلانات", value: `$${platformRevenueMock.adRevenue.toLocaleString()}`, icon: TrendingUp },
    { label: "اشتراكات Premium", value: `$${platformRevenueMock.premiumRevenue.toLocaleString()}`, icon: Users },
    { label: "مدفوعات المبدعين", value: `$${platformRevenueMock.creatorPayouts.toLocaleString()}`, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
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
