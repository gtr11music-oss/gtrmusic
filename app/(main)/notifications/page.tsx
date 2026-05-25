"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/auth-store";
import { useNotificationsStore } from "@/lib/store/notifications-store";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const items = useNotificationsStore((s) => (user ? s.forUser(user.id) : []));
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const setPushEnabled = useNotificationsStore((s) => s.setPushEnabled);

  const enablePush = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    if (perm === "granted") setPushEnabled(true);
  };

  return (
    <RouteGuard requireAuth>
      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Bell className="size-7" />
            الإشعارات
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={enablePush}>
              تفعيل Push
            </Button>
            {user && (
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => markAllRead(user.id)}>
                <CheckCheck className="size-4" />
                قراءة الكل
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-muted-foreground">لا إشعارات بعد</p>
          ) : (
            items.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className={cn(!n.read && "border-primary/30 bg-primary/5")}
                  onClick={() => markRead(n.id)}
                >
                  <CardContent className="flex flex-col gap-1 p-4">
                    {n.href ? (
                      <Link href={n.href} className="font-medium hover:text-primary">
                        {n.title}
                      </Link>
                    ) : (
                      <span className="font-medium">{n.title}</span>
                    )}
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString("ar-EG")}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </RouteGuard>
  );
}
