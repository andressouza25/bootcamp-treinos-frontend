"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Chat, { type ChatIntroMessage } from "@/components/chat/chat";
import { Button } from "@/components/ui/button";

const onboardingIntroMessages: ChatIntroMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Bem-vindo ao FIT.AI! 🎉",
  },
  {
    id: "pitch",
    role: "assistant",
    text: "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
  },
  {
    id: "benefits",
    role: "assistant",
    text: "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
  },
  {
    id: "question",
    role: "assistant",
    text: "Vamos configurar seu perfil?",
  },
  {
    id: "start",
    role: "user",
    text: "Começar!",
  },
];
const onboardingInitialMessage = "Quero começar a melhorar minha saúde.";

export default function OnboardingChat() {
  const router = useRouter();
  const hasSentInitialMessageRef = useRef(false);
  const [persistErrorMessage, setPersistErrorMessage] = useState<string>();
  const [isPersistingWorkoutPlan, setIsPersistingWorkoutPlan] = useState(false);
  const { error, messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/ai",
    }),
  });

  useEffect(() => {
    if (hasSentInitialMessageRef.current) {
      return;
    }

    if (status === "streaming" || status === "submitted") {
      return;
    }

    hasSentInitialMessageRef.current = true;
    void sendMessage({ text: onboardingInitialMessage });
  }, [sendMessage, status]);

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

  const handleSendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || status === "streaming" || status === "submitted") {
      return;
    }

    setPersistErrorMessage(undefined);

    await fetch("/api/profile-from-chat", {
      body: JSON.stringify({ message: trimmedMessage }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).catch(() => undefined);
    await sendMessage({ text: trimmedMessage });
  };

  const handleAccessApp = async () => {
    if (status === "streaming" || status === "submitted" || isPersistingWorkoutPlan) {
      return;
    }

    setPersistErrorMessage(undefined);
    setIsPersistingWorkoutPlan(true);

    try {
      const response = await fetch("/api/onboarding-workout-plan", {
        body: JSON.stringify({ messages }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const responseBody = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;

        setPersistErrorMessage(
          responseBody?.message ?? "Nao foi possivel salvar o treino agora.",
        );
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setIsPersistingWorkoutPlan(false);
    }
  };

  return (
    <Chat
      errorMessage={persistErrorMessage ?? error?.message}
      headerAction={
        <Button
          className="h-9 rounded-full border border-home-surface-border bg-background px-4 text-[12px] font-semibold text-foreground hover:bg-background hover:text-foreground"
          disabled={
            isPersistingWorkoutPlan ||
            status === "streaming" ||
            status === "submitted"
          }
          onClick={handleAccessApp}
          variant="ghost"
        >
          {isPersistingWorkoutPlan ? "Acessando..." : "Acessar FIT.AI"}
        </Button>
      }
      introMessages={onboardingIntroMessages}
      isPending={
        isPersistingWorkoutPlan ||
        status === "streaming" ||
        status === "submitted"
      }
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  );
}
