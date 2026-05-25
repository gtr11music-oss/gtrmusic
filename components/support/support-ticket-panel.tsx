"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseAuth } from "@/lib/auth/client-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { canAccessSupport } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  user_id: string;
};

type Message = {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
};

/** Task 17 — support tickets with Supabase Realtime */
export function SupportTicketPanel() {
  const useSupabase = useSupabaseAuth();
  const user = useAuthStore((s) => s.user);
  const isStaff = user && canAccessSupport(user.role);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTickets = useCallback(async () => {
    const res = await fetch("/api/tickets");
    if (!res.ok) return;
    const json = await res.json();
    const list = json.tickets ?? [];
    setTickets(list);
    if (!activeId && list[0]) setActiveId(list[0].id);
  }, [activeId]);

  const loadMessages = useCallback(async (ticketId: string) => {
    const res = await fetch(`/api/tickets/${ticketId}/messages`);
    if (!res.ok) return;
    const json = await res.json();
    setMessages(json.messages ?? []);
  }, []);

  useEffect(() => {
    if (!useSupabase || !user) return;
    loadTickets();
  }, [useSupabase, user, loadTickets]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
  }, [activeId, loadMessages]);

  useEffect(() => {
    if (!useSupabase || !activeId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`ticket-${activeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${activeId}`,
        },
        (payload) => {
          const row = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === row.id) ? prev : [...prev, row]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [useSupabase, activeId]);

  const createTicket = async () => {
    if (!newSubject.trim()) return;
    setLoading(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: newSubject.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      setNewSubject("");
      await loadTickets();
    }
  };

  const sendReply = async () => {
    if (!activeId || !reply.trim()) return;
    const res = await fetch(`/api/tickets/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply.trim() }),
    });
    if (res.ok) {
      setReply("");
      await loadMessages(activeId);
    }
  };

  if (!useSupabase) {
    return (
      <p className="text-muted-foreground">
        نظام التذاكر يتطلب ربط Supabase. استخدم الدردشة التجريبية أدناه.
      </p>
    );
  }

  if (!user) {
    return <p className="text-muted-foreground">سجّل الدخول لفتح تذكرة دعم.</p>;
  }

  return (
    <div className="flex h-[calc(100dvh-10rem)] flex-col gap-4 md:flex-row">
      <Card className="md:w-72">
        <CardHeader>
          <CardTitle className="text-base">التذاكر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!isStaff && (
            <div className="flex gap-2">
              <Input
                placeholder="موضوع التذكرة"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <Button size="icon" onClick={createTicket} disabled={loading}>
                <Plus className="size-4" />
              </Button>
            </div>
          )}
          <ScrollArea className="h-64">
            {tickets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "mb-2 w-full rounded-lg border p-3 text-start text-sm",
                  activeId === t.id ? "border-primary bg-primary/10" : "border-border"
                )}
              >
                <p className="font-medium line-clamp-1">{t.subject}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {t.status}
                </Badge>
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader>
          <CardTitle className="text-base">
            {isStaff ? "رد فريق الدعم" : "محادثة الدعم"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col">
          <ScrollArea className="mb-4 flex-1 min-h-[200px]">
            <ul className="space-y-2">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    m.sender_id === user.id
                      ? "ms-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {m.body}
                </li>
              ))}
            </ul>
          </ScrollArea>
          {activeId && (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendReply();
              }}
            >
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="اكتب رسالتك..."
              />
              <Button type="submit" size="icon">
                <Send className="size-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
