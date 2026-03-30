"use client";

import type { UIMessage } from "ai";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { useEffect, useRef } from "react";

import ChatMessage from "@/components/chat/chat-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatPanelProps = {
  errorMessage?: string;
  inputValue: string;
  isPending: boolean;
  messages: UIMessage[];
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => Promise<void>;
};

const greetingMessage =
  "Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?";
const suggestedMessage = "Monte meu plano de treino";

export default function ChatPanel({
  errorMessage,
  inputValue,
  isPending,
  messages,
  onClose,
  onInputChange,
  onSendMessage,
}: ChatPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      behavior: "smooth",
      top: container.scrollHeight,
    });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-chat-overlay">
      <div className="mx-auto flex h-full w-full max-w-[393px] flex-col px-4 pb-4 pt-[160px]">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-background shadow-[0_24px_64px_rgba(0,0,0,0.16)]">
          <header className="flex items-center justify-between border-b border-chat-border px-5 py-5">
            <div className="flex items-center gap-2">
              <div className="flex size-[42px] items-center justify-center rounded-full border border-chat-icon-border bg-chat-icon-background">
                <Sparkles className="size-[18px] text-primary" />
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-[16px] font-semibold leading-[1.05] text-foreground">
                  Coach AI
                </h2>
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-chat-online" />
                  <span className="text-[12px] leading-[1.15] text-primary">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="size-6 p-0 text-chat-close hover:bg-transparent hover:text-chat-close"
              onClick={onClose}
              size="icon-xs"
              type="button"
              variant="ghost"
            >
              <X className="size-6" />
            </Button>
          </header>

          <div
            className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5"
            ref={scrollContainerRef}
          >
            {!hasMessages ? (
              <div className="flex w-full justify-start pr-[40px]">
                <div className="rounded-[12px] bg-chat-message-assistant px-3 py-3 text-[14px] leading-[1.4] text-foreground">
                  {greetingMessage}
                </div>
              </div>
            ) : null}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {errorMessage ? (
              <div className="flex w-full justify-start pr-[40px]">
                <div className="rounded-[12px] bg-chat-message-assistant px-3 py-3 text-[14px] leading-[1.4] text-foreground">
                  {errorMessage}
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-chat-border px-5 py-4">
            {!hasMessages ? (
              <div className="mb-3 overflow-x-auto">
                <Button
                  className="h-auto rounded-full bg-chat-suggestion px-4 py-2 text-[14px] font-normal leading-none text-foreground hover:bg-chat-suggestion hover:text-foreground"
                  disabled={isPending}
                  onClick={() => void onSendMessage(suggestedMessage)}
                  type="button"
                >
                  {suggestedMessage}
                </Button>
              </div>
            ) : null}

            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void onSendMessage(inputValue);
              }}
            >
              <Input
                className="h-[48px] rounded-full border-chat-input-border bg-chat-input-background px-4 text-[14px] shadow-none placeholder:text-chat-input-placeholder focus-visible:border-chat-input-border focus-visible:ring-0"
                disabled={isPending}
                onChange={(event) => onInputChange(event.target.value)}
                placeholder="Digite sua mensagem"
                value={inputValue}
              />
              <Button
                className="size-[42px] rounded-full bg-primary p-[10px] text-primary-foreground hover:bg-primary disabled:bg-primary disabled:text-primary-foreground"
                disabled={isPending || inputValue.trim().length === 0}
                size="icon"
                type="submit"
              >
                <ArrowUp className="size-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
