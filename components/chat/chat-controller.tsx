"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useRef, useState } from "react";

import ChatPanel from "@/components/chat/chat-panel";
import {
  CHAT_INITIAL_MESSAGE_QUERY_KEY,
  CHAT_OPEN_QUERY_KEY,
} from "@/lib/chat";

const emptyMessage = "";

export default function ChatController() {
  const [inputValue, setInputValue] = useState(emptyMessage);
  const [{ chatInitialMessage, chatOpen }, setChatState] = useQueryStates(
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
  const sentInitialMessageRef = useRef<string | null>(null);
  const { error, messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/ai",
    }),
  });

  useEffect(() => {
    if (!chatOpen) {
      sentInitialMessageRef.current = null;
      return;
    }

    if (!chatInitialMessage || messages.length > 0) {
      return;
    }

    if (sentInitialMessageRef.current === chatInitialMessage) {
      return;
    }

    sentInitialMessageRef.current = chatInitialMessage;
    void sendMessage({ text: chatInitialMessage });
    void setChatState({
      chatInitialMessage: null,
    });
  }, [chatInitialMessage, chatOpen, messages.length, sendMessage, setChatState]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    void fetch("/api/profile-from-chat", {
      body: JSON.stringify({ messages }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).catch(() => undefined);
  }, [messages]);

  const handleClose = () => {
    setInputValue(emptyMessage);
    sentInitialMessageRef.current = null;
    void setChatState({
      chatInitialMessage: null,
      chatOpen: null,
    });
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || status === "streaming" || status === "submitted") {
      return;
    }

    setInputValue(emptyMessage);
    await fetch("/api/profile-from-chat", {
      body: JSON.stringify({ message: trimmedMessage }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).catch(() => undefined);
    await sendMessage({ text: trimmedMessage });
  };

  if (!chatOpen) {
    return null;
  }

  return (
    <ChatPanel
      errorMessage={error?.message}
      inputValue={inputValue}
      isPending={status === "streaming" || status === "submitted"}
      messages={messages}
      onClose={handleClose}
      onInputChange={handleInputChange}
      onSendMessage={handleSendMessage}
    />
  );
}
