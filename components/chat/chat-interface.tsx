"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { useChatStore, simulateChatActivity } from "@/lib/store/chat-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const rooms = useChatStore((s) => s.rooms);
  const activeRoomId = useChatStore((s) => s.activeRoomId);
  const setActiveRoom = useChatStore((s) => s.setActiveRoom);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const messagesForRoom = useChatStore((s) => s.messagesForRoom);
  const messages = messagesForRoom(activeRoomId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeRoomId]);

  useEffect(() => {
    const cleanup = simulateChatActivity(activeRoomId);
    return cleanup;
  }, [activeRoomId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    const rl = checkRateLimit(`chat-${user.id}`, 30, 60_000);
    if (!rl.allowed) return;
    sendMessage(activeRoomId, user.id, user.name, text.trim(), user.verified);
    setText("");
  };

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col gap-4 md:flex-row md:h-[calc(100dvh-10rem)]">
      <aside className="flex gap-2 overflow-x-auto md:w-56 md:flex-col md:overflow-visible">
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => setActiveRoom(room.id)}
            className={cn(
              "shrink-0 rounded-lg border px-4 py-3 text-start text-sm transition-colors md:w-full",
              activeRoomId === room.id
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-accent"
            )}
          >
            <p className="font-medium">{room.name}</p>
            <p className="text-xs text-muted-foreground">{room.memberCount} عضو</p>
          </button>
        ))}
      </aside>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h2 className="font-bold">{activeRoom?.name}</h2>
          <p className="text-xs text-muted-foreground">{activeRoom?.description}</p>
        </div>
        <ScrollArea className="flex-1 p-4">
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  m.userId === user?.id
                    ? "ms-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <div className="mb-0.5 flex items-center gap-1 font-medium text-xs opacity-80">
                  {m.userName}
                  <VerifiedBadge verified={m.userVerified} size="sm" />
                </div>
                {m.text}
              </li>
            ))}
            <div ref={bottomRef} />
          </ul>
        </ScrollArea>
        {user ? (
          <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-4">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب رسالة..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="size-4" />
            </Button>
          </form>
        ) : (
          <p className="border-t border-border p-4 text-center text-sm text-muted-foreground">
            <a href="/login" className="text-primary">سجّل الدخول</a> للدردشة
          </p>
        )}
      </div>
    </div>
  );
}
