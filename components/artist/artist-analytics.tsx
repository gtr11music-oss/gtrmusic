"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RevenueChart } from "@/components/charts/revenue-chart";

import { useMonetizationStore } from "@/lib/store/monetization-store";
import { useHistoryStore } from "@/lib/store/history-store";
import { useUploadStore } from "@/lib/store/upload-store";

export function ArtistAnalytics() {
  // الأرباح والإحصائيات
  const earnings = useMonetizationStore(
    (state: any) => state.earnings
  );

  // سجل الاستماع
  const history =
    useHistoryStore((state: any) => state.history) || [];

  // الملفات
  const uploads =
    useUploadStore((state: any) => state.uploads) || [];

  // ساعات الاستماع
  const listenHours = Math.round(
    history.reduce(
      (acc: number, item: any) =>
        acc + (item.totalListenSeconds || 0),
      0
    ) / 3600
  );

  // المحتوى المنشور
  const published = uploads.filter(
    (u: any) => u.status === "published"
  ).length;

  // المحتوى المعلق
  const pending = uploads.filter(
    (u: any) => u.status === "pending"
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* التشغيلات */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              التشغيلات
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {earnings?.totalStreams?.toLocaleString("ar-EG") || 0}
            </p>
          </CardContent>
        </Card>

        {/* المتابعين */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              المتابعين
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {earnings?.totalFollowers?.toLocaleString("ar-EG") || 0}
            </p>
          </CardContent>
        </Card>

        {/* ساعات الاستماع */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              ساعات الاستماع
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {listenHours.toLocaleString("ar-EG")}
            </p>
          </CardContent>
        </Card>

        {/* المحتوى */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              محتوى منشور / معلق
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">
              {published} / {pending}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* تحليلات الأرباح */}
      <Card>
        <CardHeader>
          <CardTitle>
            تحليلات الأرباح الشهرية
          </CardTitle>
        </CardHeader>

        <CardContent>
          <RevenueChart
            data={earnings?.monthly || []}
            type="bar"
          />
        </CardContent>
      </Card>
    </div>
  );
}