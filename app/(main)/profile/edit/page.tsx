"use client";

import { useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { useSupabaseAuth } from "@/lib/auth/client-auth";

export default function ProfileEditPage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const useSupabase = useSupabaseAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (useSupabase) {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? "فشل الحفظ");
        return;
      }
    }
    updateProfile({ name, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <RouteGuard requireAuth>
      <div className="mx-auto max-w-lg p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>تعديل الملف الشخصي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>الاسم</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>نبذة</Label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 min-h-[80px] w-full rounded-md border border-input bg-transparent p-3 text-sm"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" onClick={handleSave}>
              {saved ? "تم الحفظ ✓" : "حفظ"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
