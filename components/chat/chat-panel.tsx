"use client";

import type { UIMessage } from "ai";

import Chat from "@/components/chat/chat";

const greetingMessage =
  "Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?";
const suggestedMessage = "Monte meu plano de treino";

type ChatPanelProps = {
  errorMessage?: string;
  isPending: boolean;
  messages: UIMessage[];
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
};

export default function ChatPanel({
  errorMessage,
  isPending,
  messages,
  onClose,
  onSendMessage,
}: ChatPanelProps) {
  return (
    <div className="fixed inset-0 z-50 bg-chat-overlay">
      <div className="mx-auto flex h-full w-full max-w-[393px] flex-col px-4 pb-4 pt-[160px]">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-background shadow-[0_24px_64px_rgba(0,0,0,0.16)]">
          <Chat
            errorMessage={errorMessage}
            introMessages={[
              {
                id: "greeting",
                role: "assistant",
                text: greetingMessage,
              },
            ]}
            isPending={isPending}
            messages={messages}
            onClose={onClose}
            onSendMessage={onSendMessage}
            suggestedMessage={suggestedMessage}
          />
        </div>
      </div>
    </div>
  );
}
