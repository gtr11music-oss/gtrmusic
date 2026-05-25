"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Music, Mic2, Check, X, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { pendingUploads } from "@/lib/data/mock";
import { ar } from "@/lib/i18n/ar";
import { useUploadStore } from "@/lib/store/upload-store";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { useSupabaseAuth } from "@/lib/auth/client-auth";
import { isSupabaseConfigured } from "@/lib/env";
import { getPublicSupabaseConfig } from "@/lib/env";

type PendingSong = {
  id: string;
  title: string;
  genre: string | null;
  cover_path: string | null;
  artist_id: string;
  status: string;
  created_at: string;
};

export function AdminUploadsTab() {
  const useSupabase = useSupabaseAuth() && isSupabaseConfigured();
  const uploads = useUploadStore((s) => s.uploads);
  const updateStatus = useUploadStore((s) => s.updateStatus);
  const publishItem = useUploadStore((s) => s.publishItem);
  const addNotification = useNotificationsStore((s) => s.add);

  const [remotePending, setRemotePending] = useState<PendingSong[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPending = useCallback(async () => {
    if (!useSupabase) return;
    setLoading(true);
    const res = await fetch("/api/songs?status=pending&limit=50");
    setLoading(false);
    if (res.ok) {
      const json = await res.json();
      setRemotePending(json.songs ?? []);
    }
  }, [useSupabase]);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const mockPending = pendingUploads.map((p) => ({
    ...p,
    type: p.type ?? ("music" as const),
  }));

  const userPending = uploads.filter(
    (u) => u.status === "pending" || u.status === "processing"
  );

  const coverUrl = (path: string | null) => {
    if (!path) return undefined;
    const { url } = getPublicSupabaseConfig();
    return `${url}/storage/v1/object/public/covers/${path}`;
  };

  const moderateRemote = async (id: string, status: "approved" | "rejected") => {
    const res = await fetch(`/api/songs/${id}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await loadPending();
  };

  const handleApproveMock = (item: (typeof mockPending)[0]) => {
    const inStore = uploads.some((u) => u.id === item.id);
    if (inStore) updateStatus(item.id, "published");
    else publishItem({ ...item, type: item.type ?? "music", status: "published" });
    if (item.uploadedBy) {
      addNotification({
        userId: item.uploadedBy,
        title: "تمت الموافقة",
        body: `تم نشر ${item.title}`,
        type: "moderation",
        href: "/trending",
      });
    }
  };

  const allMock = [...mockPending, ...userPending];

  return (
    <div className="space-y-6">
      {useSupabase && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>أغاني Supabase (معلقة)</span>
              <Badge>{remotePending.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> جاري التحميل...
              </p>
            )}
            {!loading && remotePending.length === 0 && (
              <p className="text-muted-foreground">لا توجد أغاني معلقة في قاعدة البيانات</p>
            )}
            {remotePending.map((song) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-border bg-gtr-surface/30 p-4"
              >
                <div className="flex gap-4">
                  {song.cover_path && (
                    <div className="relative size-20 overflow-hidden rounded-lg">
                      <Image
                        src={coverUrl(song.cover_path)!}
                        alt={song.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{song.title}</p>
                    <p className="text-sm text-muted-foreground">{song.genre ?? "—"}</p>
                    <Badge variant="outline" className="mt-2">
                      {song.status}
                    </Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="gap-1 bg-gtr-accent text-black"
                    onClick={() => moderateRemote(song.id, "approved")}
                  >
                    <Check className="size-4" />
                    قبول
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={() => moderateRemote(song.id, "rejected")}
                  >
                    <X className="size-4" />
                    رفض
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{ar.admin.moderation} (محلي)</span>
            <Badge>{allMock.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allMock.length === 0 ? (
            <p className="text-muted-foreground">لا توجد طلبات محلية</p>
          ) : (
            allMock.map((item) => (
              <motion.div
                key={item.id}
                className="rounded-xl border border-border p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.artist}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => handleApproveMock(item)}>
                    <Check className="size-4" />
                    قبول
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(item.id, "rejected")}
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
    </div>
  );
}
