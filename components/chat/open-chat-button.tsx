"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        const url = new URL(window.location.href);

        if (initialMessage) {
          url.searchParams.set(CHAT_INITIAL_MESSAGE_QUERY_KEY, initialMessage);
        } else {
          url.searchParams.delete(CHAT_INITIAL_MESSAGE_QUERY_KEY);
        }

        url.searchParams.set(CHAT_OPEN_QUERY_KEY, "true");

        router.push(`${url.pathname}${url.search}${url.hash}`, {
          scroll: false,
        });
      }}
      size={size}
      type="button"
      variant={variant}
    >
      {children}
    </Button>
  );
}
