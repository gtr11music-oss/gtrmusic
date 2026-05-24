"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { adminStats } from "@/lib/data/mock";
import { buildMonthlyAnalytics } from "@/lib/data/analytics";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function AdminAnalyticsTab() {
  const monthly = buildMonthlyAnalytics(adminStats.dailyPlays * 30);
  const growth = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"].map((m, i) => ({
    name: m,
    users: 8000 + i * 1200,
    streams: adminStats.dailyPlays * (0.8 + i * 0.05),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>نمو المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={growth}>
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#132238", border: "none" }} />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>تحليلات التشغيل</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={monthly} type="bar" />
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>إحصائيات المنصة</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString("ar-EG")}</p>
            <p className="text-sm text-muted-foreground">مستخدم</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{adminStats.totalTracks.toLocaleString("ar-EG")}</p>
            <p className="text-sm text-muted-foreground">أغنية</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{adminStats.dailyPlays.toLocaleString("ar-EG")}</p>
            <p className="text-sm text-muted-foreground">تشغيل يومي</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{adminStats.pendingUploads}</p>
            <p className="text-sm text-muted-foreground">رفوعات معلقة</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
