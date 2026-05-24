"use client";

import { motion } from "framer-motion";
import { ar } from "@/lib/i18n/ar";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative mx-4 mb-8 overflow-hidden rounded-2xl gtr-gradient gtr-glow md:mx-8"
    >
      <motion.div
        className="pointer-events-none absolute -start-20 -top-20 size-64 rounded-full bg-primary/30 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute -end-10 bottom-0 size-48 rounded-full bg-gtr-accent/20 blur-2xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 flex flex-col gap-4 p-8 md:p-12">
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-primary"
        >
          {ar.tagline}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg text-3xl font-bold leading-tight md:text-5xl"
        >
          {ar.appName} — استمع لأفضل الموسيقى العربية
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="max-w-md text-muted-foreground"
        >
          تطبيق PWA — آلاف الأغاني، بودكاست، ربح للمبدعين، وتوصيات ذكية.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap gap-3"
        >
          <Button asChild size="lg" className="bg-gtr-accent hover:bg-gtr-accent/90 text-black">
            <Link href="/trending">استكشف الرائج</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/premium">Premium</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/legal/verification">طلب توثيق</Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
