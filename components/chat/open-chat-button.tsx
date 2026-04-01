"use client";

import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  CHAT_INITIAL_MESSAGE_QUERY_KEY,
  CHAT_OPEN_QUERY_KEY,
} from "@/lib/chat";

type OpenChatButtonProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  initialMessage?: string;
  size?: "default" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | "xs" | "sm" | "lg";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
};

export default function OpenChatButton({
  ariaLabel,
  children,
  className,
  initialMessage,
  size = "default",
  variant = "default",
}: OpenChatButtonProps) {
  const [, setChatState] = useQueryStates(
    {
      chatInitialMessage: parseAsString,
      chatOpen: parseAsBoolean,
    },
    {
      urlKeys: {
        chatInitialMessage: CHAT_INITIAL_MESSAGE_QUERY_KEY,
        chatOpen: CHAT_OPEN_QUERY_KEY,
      },
    },
  );

  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      onClick={() =>
        void setChatState({
          chatInitialMessage: initialMessage ?? null,
          chatOpen: true,
        })
      }
      size={size}
      type="button"
      variant={variant}
    >
      {children}
    </Button>
  );
}
