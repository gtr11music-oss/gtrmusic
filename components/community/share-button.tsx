"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCommunityStore } from "@/lib/store/community-store";

export function ShareButton({ trackId }: { trackId: string }) {
  const [copied, setCopied] = useState(false);
  const shareTrack = useCommunityStore((s) => s.shareTrack);

  const handleShare = async () => {
    const url = shareTrack(trackId);
    try {
      if (navigator.share) {
        await navigator.share({ title: "GTRmusic", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleShare}>
      {copied ? <Check className="size-4 text-gtr-accent" /> : <Share2 className="size-4" />}
    </Button>
  );
}
