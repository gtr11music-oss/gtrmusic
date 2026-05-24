"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCommunityStore } from "@/lib/store/community-store";
import { cn } from "@/lib/utils";

export function LikeButton({ trackId, className }: { trackId: string; className?: string }) {
  const liked = useCommunityStore((s) => s.isLiked(trackId));
  const toggle = useCommunityStore((s) => s.toggleLike);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={() => toggle(trackId)}
      aria-pressed={liked}
    >
      <motion.span whileTap={{ scale: 1.2 }}>
        <Heart className={cn("size-4", liked && "fill-red-500 text-red-500")} />
      </motion.span>
    </Button>
  );
}
