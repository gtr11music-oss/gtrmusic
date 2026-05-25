"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Settings, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { FollowButton } from "@/components/community/follow-button";
import { ReportDialog } from "@/components/moderation/report-dialog";
import { useAuthStore } from "@/lib/store/auth-store";
import { demoUser } from "@/lib/data/mock";
import { useCommunityStore } from "@/lib/store/community-store";
import { usePublicCatalog } from "@/hooks/use-public-catalog";
import { TrackRow } from "@/components/music/track-row";

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const currentUser = useAuthStore((s) => s.user);
  const catalog = usePublicCatalog();
  const likedIds = useCommunityStore((s) => s.likedTracks);
  const isOwn = currentUser?.id === id;

  const profile =
    isOwn && currentUser
      ? currentUser
      : id === demoUser.id
        ? demoUser
        : {
            ...demoUser,
            id,
            name: `مستخدم ${id.slice(-4)}`,
            email: "user@gtrmusic.com",
            role: "user" as const,
            verified: false,
          };

  const liked = likedIds.map((tid) => catalog.getTrackById(tid)).filter(Boolean);

  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 gtr-gradient" />
        <CardContent className="relative pt-0">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative size-24 overflow-hidden rounded-full border-4 border-background">
              <Image src={profile.avatar} alt={profile.name} fill className="object-cover" sizes="96px" />
            </div>
            <div className="flex-1">
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                {profile.name}
                <VerifiedBadge verified={profile.verified} size="md" />
              </h1>
              <p className="text-sm text-muted-foreground">{profile.role}</p>
              {profile.bio && <p className="mt-2 text-sm">{profile.bio}</p>}
            </div>
            <div className="flex gap-2">
              {isOwn ? (
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">
                    <Settings className="size-4" />
                    لوحة التحكم
                  </Link>
                </Button>
              ) : (
                <>
                  <FollowButton artistId={id} />
                  <ReportDialog targetType="user" targetId={id} targetLabel={profile.name} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <Music className="size-5" />
        {isOwn ? "المفضلة" : "النشاط"}
      </h2>
      <div className="rounded-xl bg-gtr-surface/50 p-2">
        {liked.length > 0 ? (
          liked.map((t, i) => t && <TrackRow key={t.id} track={t} index={i + 1} />)
        ) : (
          <p className="p-4 text-muted-foreground">لا أغاني مفضلة بعد</p>
        )}
      </div>
    </div>
  );
}
