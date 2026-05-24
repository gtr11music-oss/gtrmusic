"use client";

import { create } from "zustand";
import type { ChatMessage, ChatRoom } from "@/types";

const rooms: ChatRoom[] = [
  { id: "general", name: "الدردشة العامة", description: "ناقش الموسيقى العربية", memberCount: 1284 },
  { id: "artists", name: "فنانون", description: "للمبدعين والفنانين", memberCount: 342 },
  { id: "support", name: "الدعم", description: "مساعدة GTRmusic", memberCount: 89 },
];

const seedMessages: ChatMessage[] = [
  {
    id: "m1",
    roomId: "general",
    userId: "bot",
    userName: "GTRmusic",
    text: "مرحباً بكم في الدردشة المباشرة!",
    createdAt: new Date().toISOString(),
  },
];

interface ChatState {
  rooms: ChatRoom[];
  messages: ChatMessage[];
  activeRoomId: string;
  setActiveRoom: (id: string) => void;
  sendMessage: (
    roomId: string,
    userId: string,
    userName: string,
    text: string,
    userVerified?: boolean
  ) => void;
  messagesForRoom: (roomId: string) => ChatMessage[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms,
  messages: seedMessages,
  activeRoomId: "general",

  setActiveRoom: (activeRoomId) => set({ activeRoomId }),

  sendMessage: (roomId, userId, userName, text, userVerified) => {
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      roomId,
      userId,
      userName,
      userVerified,
      text,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  messagesForRoom: (roomId) =>
    get()
      .messages.filter((m) => m.roomId === roomId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
}));

/** محاكاة رسائل فورية من مستخدمين آخرين */
export function simulateChatActivity(
  roomId: string,
  onMessage: (msg: ChatMessage) => void
) {
  const samples = [
    "أغنية رائعة!",
    "من يعرف فنان خليجي جديد؟",
    "GTRmusic أفضل منصة",
  ];
  const id = setInterval(() => {
    onMessage({
      id: `sim-${Date.now()}`,
      roomId,
      userId: "sim-user",
      userName: "مستمع",
      text: samples[Math.floor(Math.random() * samples.length)],
      createdAt: new Date().toISOString(),
    });
  }, 12000);
  return () => clearInterval(id);
}
