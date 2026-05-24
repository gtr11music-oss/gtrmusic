"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ar } from "@/lib/i18n/ar";

interface SectionRowProps {
  title: string;
  href?: string;
  children: React.ReactNode;
}

export function SectionRow({ title, href, children }: SectionRowProps) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between px-4 md:px-8">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {ar.common.viewAll}
            <ChevronLeft className="size-4" />
          </Link>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide md:px-8"
      >
        {children}
      </motion.div>
    </section>
  );
}
