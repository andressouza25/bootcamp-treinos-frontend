"use client";

import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

type ChatMessageProps = {
  message: UIMessage;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const textParts = message.parts.filter((part) => part.type === "text");
  const isAssistantMessage = message.role === "assistant";

  if (textParts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full",
        isAssistantMessage ? "justify-start pr-[60px]" : "justify-end pl-[60px]",
      )}
    >
      <div
        className={cn(
          "rounded-[12px] px-3 py-3 text-[14px] leading-[1.4] break-words",
          isAssistantMessage
            ? "bg-chat-message-assistant text-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        {textParts.map((part, index) => (
          <Streamdown
            className="prose prose-p:my-0 prose-strong:text-inherit prose-em:text-inherit max-w-none text-inherit"
            key={`${message.id}-${index}`}
          >
            {part.text}
          </Streamdown>
        ))}
      </div>
    </div>
  );
}
