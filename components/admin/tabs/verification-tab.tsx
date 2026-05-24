"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { artists } from "@/lib/data/mock";

import { useVerificationStore } from "@/lib/store/verification-store";

import { useAuthStore } from "@/lib/store/auth-store";

import { useNotificationsStore } from "@/lib/store/notifications-store";

export function AdminVerificationTab() {

  // إصلاح Infinite Loop
  const requests = useVerificationStore(
    (s) => s.requests
  );

  const pending = requests.filter(
    (r) => r.status === "pending"
  );

  const approve = useVerificationStore(
    (s) => s.approve
  );

  const reject = useVerificationStore(
    (s) => s.reject
  );

  const setVerified = useAuthStore(
    (s) => s.setVerified
  );

  const addNotification = useNotificationsStore(
    (s) => s.add
  );

  const handleApprove = (
    id: string,
    userId: string
  ) => {

    approve(id);

    setVerified(true);

    addNotification({
      userId,
      title: "تم توثيق حسابك",
      body: "تهانينا! أصبح حسابك موثقاً",
      type: "verification",
      href: "/profile",
    });
  };

  return (
    <div className="space-y-6">

      {/* طلبات التوثيق */}
      <Card>

        <CardHeader>
          <CardTitle>
            طلبات التوثيق ({pending.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {pending.length === 0 ? (

            <p className="text-muted-foreground">
              لا توجد طلبات معلقة
            </p>

          ) : (

            pending.map((req) => (

              <div
                key={req.id}
                className="rounded-lg border border-border p-4"
              >

                <p className="font-medium">
                  {req.userName}
                </p>

                <p className="text-sm text-muted-foreground">
                  الوثيقة:
                  {" "}
                  {req.documentName ?? "—"}
                </p>

                <ul className="mt-2 text-sm space-y-1">

                  {req.socialLinks.map((link) => (

                    <li key={link}>

                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link}
                      </a>

                    </li>

                  ))}

                </ul>

                <div className="mt-4 flex gap-2">

                  <Button
                    size="sm"
                    onClick={() =>
                      handleApprove(
                        req.id,
                        req.userId
                      )
                    }
                  >
                    موافقة
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      reject(req.id)
                    }
                  >
                    رفض
                  </Button>

                </div>

              </div>

            ))

          )}

        </CardContent>

      </Card>

      {/* الفنانون الموثقون */}
      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <BadgeCheck className="size-5" />

            فنانون موثقون

          </CardTitle>

        </CardHeader>

        <CardContent>

          {artists
            .filter((artist) => artist.verified)
            .map((artist) => (

              <div
                key={artist.id}
                className="mb-3 flex items-center gap-3"
              >

                <div className="relative size-10 overflow-hidden rounded-full">

                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />

                </div>

                <span>{artist.name}</span>

                <Badge>
                  ✓
                </Badge>

              </div>

            ))}

        </CardContent>

      </Card>

    </div>
  );
}