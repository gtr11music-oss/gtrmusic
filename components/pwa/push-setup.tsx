"use client";

import { useEffect, useState } from "react";
import { useNotificationsStore } from "@/lib/store/notifications-store";

export function PushSetup() {
  const [mounted, setMounted] = useState(false);

  const pushEnabled = useNotificationsStore((s) => s.pushEnabled);
  const setPushEnabled = useNotificationsStore((s) => s.setPushEnabled);

  useEffect(() => {
    setMounted(true);
  }, []);

  const enablePush = async () => {
    if (typeof window === "undefined") return;

    try {
      if (!("Notification" in window)) return;

      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        setPushEnabled(true);
      }
    } catch (error) {
      console.error("Push error:", error);
    }
  };

  // يمنع مشكلة Hydration
  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={enablePush}
      className="sr-only"
      aria-label="تفعيل الإشعارات"
    >
      Enable Push
    </button>
  );
}