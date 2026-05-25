"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoUser } from "@/lib/data/mock";
import { useReportsStore } from "@/lib/store/reports-store";
import { useSupabaseAuth } from "@/lib/auth/client-auth";

type Profile = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  is_premium: boolean;
};

const mockUsers = [
  demoUser,
  { ...demoUser, id: "u2", name: "مستمع", email: "user@test.com", role: "user" as const, verified: false },
];

export function AdminUsersTab() {
  const getUserStrikes = useReportsStore((s) => s.getUserStrikes);
  const useSupabase = useSupabaseAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!useSupabase) return;
    fetch("/api/admin/profiles")
      .then((r) => r.json())
      .then((j) => setProfiles(j.profiles ?? []));
  }, [useSupabase]);

  const list = useSupabase
    ? profiles
    : mockUsers.map((u) => ({
        id: u.id,
        email: u.email,
        display_name: u.name,
        role: u.role,
        is_premium: false,
      }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستخدمين ({list.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.length === 0 && (
          <p className="text-muted-foreground">لا مستخدمين — تأكد من service_role في .env</p>
        )}
        {list.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"
          >
            <div>
              <p className="font-medium">{u.display_name}</p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{u.role}</Badge>
              {u.is_premium && <Badge className="bg-amber-500/20">Premium</Badge>}
              {getUserStrikes(u.id) > 0 && (
                <Badge variant="destructive">{getUserStrikes(u.id)} strikes</Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
