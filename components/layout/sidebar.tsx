"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  TrendingUp,
  Library,
  ListMusic,
  Mic2,
  MessageCircle,
  Upload,
  LayoutDashboard,
  Shield,
  LogIn,
  LogOut,
  DollarSign,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ar } from "@/lib/i18n/ar";
import { useAuthStore } from "@/lib/store/auth-store";
import { canAccessAdmin } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/", label: ar.nav.home, icon: Home },
  { href: "/search", label: ar.nav.search, icon: Search },
  { href: "/trending", label: ar.nav.trending, icon: TrendingUp },
  { href: "/library", label: ar.nav.library, icon: Library },
  { href: "/playlists", label: ar.nav.playlists, icon: ListMusic },
  { href: "/podcasts", label: ar.nav.podcasts, icon: Mic2 },
  { href: "/chat", label: "الدردشة", icon: MessageCircle },
] as const;

const creatorNav = [
  { href: "/upload", label: ar.nav.upload, icon: Upload },
  { href: "/dashboard", label: ar.nav.dashboard, icon: LayoutDashboard },
  { href: "/monetization", label: "الربح", icon: DollarSign },
] as const;

const premiumNav = { href: "/premium", label: "Premium", icon: Crown } as const;

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-e border-border bg-sidebar md:flex">
      <div className="p-6">
        <Logo />
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {mainNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="block">
                <motion.span
                  whileHover={{ x: -4 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </motion.span>
              </Link>
            );
          })}
        </nav>
        <Separator className="my-4" />
        <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
          المنشئون
        </p>
        <nav className="space-y-1">
          <Link href={premiumNav.href} className="block">
            <span
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === premiumNav.href
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <premiumNav.icon className="size-5 shrink-0" />
              {premiumNav.label}
            </span>
          </Link>
          {creatorNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="block">
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </span>
              </Link>
            );
          })}
          {isAuthenticated && user && canAccessAdmin(user.role) && (
            <Link href="/admin" className="block">
              <span
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/admin"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Shield className="size-5 shrink-0" />
                {ar.nav.admin}
              </span>
            </Link>
          )}
        </nav>
      </ScrollArea>
      <div className="border-t border-border p-4">
        {isAuthenticated ? (
          <div className="space-y-3">
            <Link href="/profile/edit" className="text-xs text-muted-foreground hover:text-primary">
              تعديل الملف
            </Link>
            <Link href="/notifications" className="text-xs text-muted-foreground hover:text-primary">
              الإشعارات
            </Link>
            <Link href="/profile" className="flex items-center gap-3 rounded-lg px-1 hover:bg-accent">
              <div className="size-9 rounded-full bg-gtr-surface bg-cover bg-center" style={{ backgroundImage: `url(${user?.avatar})` }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </Link>
            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
              <Link href="/legal/privacy" className="hover:text-foreground">خصوصية</Link>
              <Link href="/legal/terms" className="hover:text-foreground">شروط</Link>
              <Link href="/legal/contact" className="hover:text-foreground">اتصل</Link>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
              <LogOut className="size-4" />
              {ar.nav.logout}
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full gap-2">
            <Link href="/login">
              <LogIn className="size-4" />
              {ar.nav.login}
            </Link>
          </Button>
        )}
      </div>
    </aside>
  );
}
