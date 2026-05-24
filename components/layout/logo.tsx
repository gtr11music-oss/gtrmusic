import Link from "next/link";
import { Music2 } from "lucide-react";
import { ar } from "@/lib/i18n/ar";
import { cn } from "@/lib/utils";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-bold text-foreground", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/20 text-primary">
        <Music2 className="size-5" />
      </span>
      {!compact && (
        <span className="text-xl tracking-tight">
          {ar.appName}
          <span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
