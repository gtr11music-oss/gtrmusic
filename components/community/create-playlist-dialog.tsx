"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCommunityStore } from "@/lib/store/community-store";

export function CreatePlaylistDialog({ trackIds = [] }: { trackIds?: string[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const user = useAuthStore((s) => s.user);
  const addPlaylist = useCommunityStore((s) => s.addPlaylist);

  const handleCreate = () => {
    if (!user || !title.trim()) return;
    addPlaylist({
      title: title.trim(),
      description: description.trim() || "قائمة شخصية",
      cover: `https://picsum.photos/seed/${encodeURIComponent(title)}/400/400`,
      trackIds,
      owner: user.name,
      ownerId: user.id,
      isPublic: true,
    });
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={!user}>
          <Plus className="size-4" />
          قائمة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إنشاء قائمة تشغيل</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>العنوان</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>الوصف</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleCreate}>
            إنشاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
