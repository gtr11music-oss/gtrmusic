"use client";

import { Music2, Mic2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  getPublicPodcasts,
  getPublicTracks,
} from "@/lib/data/uploads-adapter";

import { useUploadStore } from "@/lib/store/upload-store";

export function AdminContentTab() {
  // إصلاح مشكلة Infinite Loop
  const uploads = useUploadStore((s) => s.uploads);

  // المحتوى المنشور فقط
  const published = uploads.filter(
    (u) => u.status === "published"
  );

  const publicTracks = getPublicTracks(published);

  const publicPodcasts =
    getPublicPodcasts(published);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* الأغاني */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music2 className="size-5" />
            الأغاني المنشورة
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {publicTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <p className="font-medium">
                  {track.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {track.artist}
                </p>
              </div>

              <Badge>
                {track.genre}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* البودكاست */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic2 className="size-5" />
            البودكاست المنشور
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {publicPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <p className="font-medium">
                  {podcast.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {podcast.showName}
                </p>
              </div>

              <Badge>
                بودكاست
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}