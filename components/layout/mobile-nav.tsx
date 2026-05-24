"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, TrendingUp, Library, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ar } from "@/lib/i18n/ar";

const items = [
  { href: "/", label: ar.nav.home, icon: Home },
  { href: "/search", label: ar.nav.search, icon: Search },
  { href: "/trending", label: ar.nav.trending, icon: TrendingUp },
  { href: "/chat", label: "دردشة", icon: MessageCircle },
  { href: "/library", label: ar.nav.library, icon: Library },
  { href: "/profile", label: "حسابي", icon: User },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-[72px] z-40 border-t border-border bg-sidebar/95 backdrop-blur-lg md:hidden">
      <ul className="flex items-center justify-around px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
