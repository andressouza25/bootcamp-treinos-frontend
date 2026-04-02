"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import ChatController from "@/components/chat/chat-controller";

export default function ChatControllerProvider() {
  return (
    <NuqsAdapter>
      <ChatController />
    </NuqsAdapter>
  );
}
