"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoUser } from "@/lib/data/mock";
import { useReportsStore } from "@/lib/store/reports-store";

const mockUsers = [
  demoUser,
  { ...demoUser, id: "u2", name: "مستمع", email: "user@test.com", role: "user" as const, verified: false },
  { ...demoUser, id: "u3", name: "فنان", email: "artist@test.com", role: "verified_artist" as const, verified: true },
];

export function AdminUsersTab() {
  const getUserStrikes = useReportsStore((s) => s.getUserStrikes);

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockUsers.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{u.role}</Badge>
              {u.verified && <Badge className="bg-primary/20">موثق</Badge>}
              {getUserStrikes(u.id) > 0 && (
                <Badge variant="destructive">{getUserStrikes(u.id)} strikes</Badge>
              )}
            </div>
            <Button size="sm" variant="outline">
              إدارة
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
