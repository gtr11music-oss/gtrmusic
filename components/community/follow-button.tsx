"use client";

import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunityStore } from "@/lib/store/community-store";

export function FollowButton({ artistId }: { artistId: string }) {
  const following = useCommunityStore((s) => s.isFollowing(artistId));
  const toggle = useCommunityStore((s) => s.toggleFollow);

  return (
    <Button
      variant={following ? "secondary" : "default"}
      size="sm"
      className="gap-2"
      onClick={() => toggle(artistId)}
    >
      {following ? (
        <>
          <UserCheck className="size-4" /> متابع
        </>
      ) : (
        <>
          <UserPlus className="size-4" /> متابعة
        </>
      )}
    </Button>
  );
}
