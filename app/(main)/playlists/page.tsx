"use client";

import { motion } from "framer-motion";
import { PlaylistCard } from "@/components/music/playlist-card";
import { ar } from "@/lib/i18n/ar";
import { playlists } from "@/lib/data/mock";

export default function PlaylistsPage() {
  return (
    <div className="p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 text-2xl font-bold md:text-3xl"
      >
        {ar.nav.playlists}
      </motion.h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {playlists.map((playlist, i) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <PlaylistCard playlist={playlist} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
