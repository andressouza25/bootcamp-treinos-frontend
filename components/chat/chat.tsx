"use client";

import type { UIMessage } from "ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Sparkles, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ChatMessage from "@/components/chat/chat-message";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const chatComposerSchema = z.object({
  message: z.string().trim().min(1, "Digite uma mensagem"),
});

export type ChatIntroMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type ChatProps = {
  errorMessage?: string;
  headerAction?: ReactNode;
  inputPlaceholder?: string;
  introMessages?: ChatIntroMessage[];
  isPending: boolean;
  messages: UIMessage[];
  onClose?: () => void;
  onSendMessage: (message: string) => Promise<void>;
  suggestedMessage?: string;
};

export default function Chat({
  errorMessage,
  headerAction,
  inputPlaceholder = "Digite sua mensagem",
  introMessages = [],
  isPending,
  messages,
  onClose,
  onSendMessage,
  suggestedMessage,
}: ChatProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const form = useForm<z.infer<typeof chatComposerSchema>>({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(chatComposerSchema),
  });

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      behavior: "smooth",
      top: container.scrollHeight,
    });
  }, [errorMessage, introMessages, messages]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-chat-border bg-background px-5 py-5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-[42px] items-center justify-center rounded-full border border-chat-icon-border bg-chat-icon-background">
            <Sparkles className="size-[18px] text-primary" />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
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

        {headerAction}

        {!headerAction && onClose ? (
          <Button
            className="size-6 p-0 text-chat-close hover:bg-transparent hover:text-chat-close"
            onClick={onClose}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <X className="size-6" />
          </Button>
        ) : null}
      </header>

      <div
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
        ref={scrollContainerRef}
      >
        {introMessages.map((message) => (
          <div
            className={cn(
              "flex w-full",
              message.role === "assistant"
                ? "justify-start pr-[60px]"
                : "justify-end pl-[60px]",
            )}
            key={message.id}
          >
            <div
              className={cn(
                "rounded-[12px] px-3 py-3 text-[14px] leading-[1.4] break-words",
                message.role === "assistant"
                  ? "bg-chat-message-assistant text-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {message.text}
            </div>
          </div>
        ))}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {errorMessage ? (
          <div className="flex w-full justify-start pr-[60px]">
            <div className="rounded-[12px] bg-chat-message-assistant px-3 py-3 text-[14px] leading-[1.4] text-foreground">
              {errorMessage}
            </div>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 border-t border-chat-border bg-background px-5 py-4">
        {messages.length === 0 && suggestedMessage ? (
          <div className="mb-3 overflow-x-auto">
            <Button
              className="h-auto rounded-full bg-chat-suggestion px-4 py-2 text-[14px] font-normal leading-none text-foreground hover:bg-chat-suggestion hover:text-foreground"
              disabled={isPending}
              onClick={async () => {
                form.reset({ message: "" });
                await onSendMessage(suggestedMessage);
              }}
              type="button"
            >
              {suggestedMessage}
            </Button>
          </div>
        ) : null}

        <Form {...form}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <form
                className="flex items-start gap-2"
                onSubmit={form.handleSubmit(async (values) => {
                  form.reset({ message: "" });
                  await onSendMessage(values.message);
                })}
              >
                <FormItem className="flex-1 space-y-0">
                  <FormControl>
                    <Input
                      aria-label={inputPlaceholder}
                      className="h-[48px] rounded-full border-chat-input-border bg-chat-input-background px-4 text-[14px] shadow-none placeholder:text-chat-input-placeholder focus-visible:border-chat-input-border focus-visible:ring-0"
                      disabled={isPending}
                      placeholder={inputPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="px-4" />
                </FormItem>
                <Button
                  className="size-[42px] rounded-full bg-primary p-[10px] text-primary-foreground hover:bg-primary disabled:bg-primary disabled:text-primary-foreground"
                  disabled={isPending || field.value.trim().length === 0}
                  size="icon"
                  type="submit"
                >
                  <ArrowUp className="size-5" />
                </Button>
              </form>
            )}
          />
        </Form>
      </div>
    </div>
  );
}
