"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommunityStore } from "@/lib/store/community-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { checkRateLimit } from "@/lib/security/rate-limit";

export function CommentsPanel({ trackId }: { trackId: string }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const comments = useCommunityStore((s) => s.getComments(trackId));
  const addComment = useCommunityStore((s) => s.addComment);
  const user = useAuthStore((s) => s.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) {
      setError("سجّل الدخول للتعليق");
      return;
    }
    const rl = checkRateLimit(`comment-${user.id}`, 10, 60_000);
    if (!rl.allowed) {
      setError("تعليقات كثيرة — انتظر قليلاً");
      return;
    }
    addComment(trackId, user.id, user.name, text.trim(), user.verified);
    setText("");
    setError("");
  };

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <MessageCircle className="size-4" />
        التعليقات ({comments.length})
      </h3>
      <ScrollArea className="mb-4 max-h-48">
        <ul className="space-y-3">
          {comments.length === 0 ? (
            <li className="text-sm text-muted-foreground">لا تعليقات بعد</li>
          ) : (
            comments.map((c) => (
              <li key={c.id} className="text-sm">
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  {c.userName}
                  <VerifiedBadge verified={c.userVerified} size="sm" />
                </span>
                <p className="text-muted-foreground">{c.text}</p>
              </li>
            ))
          )}
        </ul>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="أضف تعليقاً..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="size-4" />
        </Button>
      </form>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
