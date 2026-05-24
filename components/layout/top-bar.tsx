"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Logo } from "@/components/layout/logo";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/sidebar";
import { ar } from "@/lib/i18n/ar";
import { useAuthStore } from "@/lib/store/auth-store";

export function TopBar() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:h-16 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{ar.appName}</SheetTitle>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="md:hidden">
        <Logo compact />
      </div>

      <div className="hidden flex-1 md:block md:max-w-xl">
        <SearchBar
          onSubmit={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
        />
      </div>

      <div className="ms-auto flex items-center gap-2">
        <div className="flex-1 md:hidden">
          <SearchBar
            compact
            onSubmit={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
          />
        </div>
        <NotificationBell />
        {!isAuthenticated && (
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link href="/register">{ar.nav.register}</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
