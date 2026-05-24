"use client";

import { useState } from "react";
import { BadgeCheck, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/auth-store";
import { useVerificationStore } from "@/lib/store/verification-store";
import { useNotificationsStore } from "@/lib/store/notifications-store";

export function VerificationRequestForm() {
  const user = useAuthStore((s) => s.user);
  const submit = useVerificationStore((s) => s.submit);
  const existing = useVerificationStore((s) =>
    user ? s.getForUser(user.id) : undefined
  );
  const addNotification = useNotificationsStore((s) => s.add);
  const [links, setLinks] = useState("");
  const [docName, setDocName] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const socialLinks = links
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    submit(user.id, user.name, socialLinks, docName || undefined);
    addNotification({
      userId: user.id,
      title: "طلب توثيق",
      body: "تم إرسال طلبك للمراجعة",
      type: "verification",
      href: "/dashboard",
    });
    setDone(true);
  };

  if (user?.verified) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-6">
          <BadgeCheck className="size-8 text-primary" />
          <p>حسابك موثق بالفعل</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeCheck className="size-5" />
          طلب شارة التوثيق
        </CardTitle>
      </CardHeader>
      <CardContent>
        {existing && (
          <Badge className="mb-4" variant="secondary">
            الحالة:{" "}
            {existing.status === "pending"
              ? "قيد المراجعة"
              : existing.status === "approved"
                ? "موافق"
                : "مرفوض"}
          </Badge>
        )}
        {done || existing?.status === "pending" ? (
          <p className="text-muted-foreground">طلبك قيد المراجعة من الإدارة</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>روابط التواصل (سطر لكل رابط)</Label>
              <textarea
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="mt-1 min-h-[80px] w-full rounded-md border border-input bg-transparent p-3 text-sm"
                placeholder="https://instagram.com/..."
                required
              />
            </div>
            <div>
              <Label htmlFor="doc">وثيقة الهوية (اسم الملف)</Label>
              <Input
                id="doc"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocName(e.target.files?.[0]?.name ?? "")}
              />
              {docName && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Upload className="size-3" />
                  {docName}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              إرسال الطلب
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
