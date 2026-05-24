"use client";

import Image from "next/image";
import Link from "next/link";
import { ListMusic } from "lucide-react";
import { motion } from "framer-motion";
import type { Playlist } from "@/types";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: Playlist;
  className?: string;
}

export function PlaylistCard({ playlist, className }: PlaylistCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className={cn("w-full", className)}>
      <Link
        href={`/playlists/${playlist.id}`}
        className="group block overflow-hidden rounded-lg bg-gtr-surface transition-colors hover:bg-gtr-surface-hover"
      >
        <div className="relative aspect-square">
          <Image
            src={playlist.cover}
            alt={playlist.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
          />
          <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/70 to-transparent p-4">
            <ListMusic className="size-8 text-white/90" />
          </div>
        </div>
        <div className="p-3">
          <p className="truncate font-semibold text-sm">{playlist.title}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {playlist.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
