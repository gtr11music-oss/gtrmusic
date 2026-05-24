import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata = {
  title: "الدردشة المباشرة",
};

export default function ChatPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold">الدردشة المباشرة</h1>
      <ChatInterface />
    </div>
  );
}
