"use client";

import { Shield } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { useReportsStore } from "@/lib/store/reports-store";

export function AdminReportsTab() {
  const reports =
    useReportsStore(
      (state: any) => state.reports
    ) || [];

  const strikes =
    useReportsStore(
      (state: any) => state.strikes
    ) || [];

  const resolveReport =
    useReportsStore(
      (state: any) => state.resolveReport
    );

  // البلاغات المعلقة فقط
  const pending = reports.filter(
    (report: any) =>
      report.status === "pending"
  );

  return (
    <div className="space-y-6">

      {/* البلاغات */}
      <Card>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            البلاغات المعلقة
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {pending.length === 0 ? (
            <p className="text-muted-foreground">
              لا توجد بلاغات
            </p>
          ) : (

            pending.map((report: any) => (

              <div
                key={report.id}
                className="rounded-lg border p-4"
              >

                <div className="flex items-center justify-between">

                  <div className="space-y-1">

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

                <div className="mt-4 flex gap-2">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      resolveReport?.(
                        report.id,
                        "dismiss"
                      )
                    }
                  >
                    تجاهل
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      resolveReport?.(
                        report.id,
                        "resolve"
                      )
                    }
                  >
                    حذف المحتوى
                  </Button>

                </div>

              </div>

            ))

          )}

        </CardContent>

      </Card>

      {/* سجل المخالفات */}
      <Card>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            سجل المخالفات
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          {strikes.length === 0 ? (

            <p className="text-muted-foreground">
              لا توجد مخالفات
            </p>

          ) : (

            strikes.map((strike: any) => (

              <div
                key={strike.id}
                className="rounded-lg border p-3"
              >

                <p className="font-medium">
                  {strike.userName}
                </p>

                <p className="text-sm text-muted-foreground">
                  {strike.reason}
                </p>

              </div>

            ))

          )}

        </CardContent>

      </Card>

    </div>
  );
}