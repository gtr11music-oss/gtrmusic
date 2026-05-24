"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Music, Mic2, Check, X, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { pendingUploads } from "@/lib/data/mock";
import { ar } from "@/lib/i18n/ar";

import { useUploadStore } from "@/lib/store/upload-store";
import { useNotificationsStore } from "@/lib/store/notifications-store";

export function AdminUploadsTab() {
  // ===== Stores =====
  const uploads = useUploadStore((s) => s.uploads);
  const updateStatus = useUploadStore((s) => s.updateStatus);

  const addNotification = useNotificationsStore((s) => s.add);

  // ===== Pending Uploads =====
  const mockPending = pendingUploads.map((p) => ({
    ...p,
    type: p.type ?? ("music" as const),
  }));

  const userPending = uploads.filter(
    (u) => u.status === "pending" || u.status === "processing"
  );

  const allPending = [...mockPending, ...userPending];

  // ===== Approve =====
  const handleApprove = (item: (typeof allPending)[0]) => {
    updateStatus(item.id, "published");

    if (item.uploadedBy) {
      addNotification({
        userId: item.uploadedBy,
        title: "تمت الموافقة",
        body: `تم نشر ${
          item.type === "podcast" ? "البودكاست" : "الأغنية"
        }: ${item.title}`,
        type: "moderation",
        href: item.type === "podcast" ? "/podcasts" : "/trending",
      });
    }
  };

  // ===== Reject =====
  const handleReject = (item: (typeof allPending)[0]) => {
    updateStatus(item.id, "rejected");

    if (item.uploadedBy) {
      addNotification({
        userId: item.uploadedBy,
        title: "تم الرفض",
        body: `لم يتم قبول: ${item.title}`,
        type: "moderation",
        href: "/dashboard",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{ar.admin.moderation}</span>

          <Badge>
            {allPending.length} طلب
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {allPending.length === 0 ? (
          <p className="text-muted-foreground">
            لا توجد طلبات معلقة حالياً
          </p>
        ) : (
          allPending.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-gtr-surface/30 p-4"
            >
              <div className="flex flex-wrap gap-4">
                {item.cover && (
                  <div className="relative size-20 overflow-hidden rounded-lg">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold">
                      {item.title}
                    </p>

                    <Badge
                      variant={
                        item.type === "podcast"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {item.type === "podcast" ? (
                        <>
                          <Mic2 className="ms-1 size-3" />
                          بودكاست
                        </>
                      ) : (
                        <>
                          <Music className="ms-1 size-3" />
                          أغنية
                        </>
                      )}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {item.artist}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    رافع المحتوى:
                    {" "}
                    {item.uploadedByName ?? "غير معروف"}
                  </p>

                  {item.description && (
                    <p className="border-s-2 border-primary/30 ps-3 text-sm">
                      {item.description}
                    </p>
                  )}

                  <Badge variant="outline">
                    {item.genre}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                >
                  <Eye className="size-4" />
                  معاينة
                </Button>

                <Button
                  size="sm"
                  className="gap-1 bg-gtr-accent text-black hover:bg-gtr-accent/90"
                  onClick={() => handleApprove(item)}
                >
                  <Check className="size-4" />
                  قبول ونشر
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  onClick={() => handleReject(item)}
                >
                  <X className="size-4" />
                  رفض
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}