"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/auth-store";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const user = useAuthStore((s) => s.user);

  const notifications = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  const items = user
    ? notifications.filter((n) => n.userId === user.id)
    : [];

  const unread = items.filter((n) => !n.read).length;

  if (!user) {
    return (
      <Button asChild variant="ghost" size="icon">
        <Link href="/login">
          <Bell className="size-5" />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />

          {unread > 0 && (
            <span className="absolute end-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="font-semibold text-sm">
            الإشعارات
          </span>

          {unread > 0 && (
            <button
              type="button"
              className="text-xs text-primary"
              onClick={() => markAllRead(user.id)}
            >
              قراءة الكل
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            لا إشعارات
          </p>
        ) : (
          items.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={cn(
                "flex flex-col items-start gap-0.5",
                !n.read && "bg-primary/5"
              )}
              onClick={() => markRead(n.id)}
              asChild
            >
              {n.href ? (
                <Link href={n.href}>
                  <span className="font-medium text-sm">
                    {n.title}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {n.body}
                  </span>
                </Link>
              ) : (
                <div>
                  <span className="font-medium text-sm">
                    {n.title}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {n.body}
                  </span>
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}