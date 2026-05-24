"use client";

import { ShieldAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { useReportsStore } from "@/lib/store/reports-store";

export function AdminCopyrightTab() {
  // البيانات الخام من Zustand
  const reports = useReportsStore((s) => s.reports);

  const strikes = useReportsStore((s) => s.strikes);

  // فلترة خارج الـ store
  const copyrightReports = reports.filter(
    (r) =>
      r.type === "copyright" ||
      r.type === "stolen_music"
  );

  return (
    <div className="space-y-6">
      {/* بلاغات حقوق النشر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5" />
            بلاغات حقوق النشر
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {copyrightReports.length === 0 ? (
            <p className="text-muted-foreground">
              لا توجد بلاغات
            </p>
          ) : (
            copyrightReports.map((report) => (
              <div
                key={report.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {report.description}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      الهدف:
                      {" "}
                      {report.targetLabel}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      بواسطة:
                      {" "}
                      {report.reporterName}
                    </p>
                  </div>

                  <Badge>
                    {report.type}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* المخالفات */}
      <Card>
        <CardHeader>
          <CardTitle>
            عدد مخالفات حقوق النشر
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">
            {strikes.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}