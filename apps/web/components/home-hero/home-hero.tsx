"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUpIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { HeroCarousel } from "@/components/home-hero/hero-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const suggestions = [
  "Show me dentists nearby",
  "Find ski instructors in Tahoe",
  "Show me veterinarians in Oakland",
];

const heroSurfaceClass =
  "relative flex min-h-[min(72vh,640px)] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border shadow-[0_1px_5px_-4px_rgba(36,36,36,0.18),0_4px_8px_0_rgba(36,36,36,0.04)] dark:shadow-[0_1px_5px_-4px_rgba(0,0,0,0.5),0_4px_8px_0_rgba(0,0,0,0.2)]";

const fadeTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

const dialogShellClass =
  "flex max-h-[min(84vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg";

function ChatMessages({
  messages,
}: {
  messages: ReturnType<typeof useChat>["messages"];
}): React.ReactElement {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Ask Discover to find or book local services near you.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div
          className={cn(
            "max-w-[90%] rounded-xl px-4 py-3 text-sm",
            message.role === "user"
              ? "ml-auto bg-primary text-primary-foreground"
              : "border bg-muted/50 text-foreground"
          )}
          key={message.id}
        >
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <p
                  className="whitespace-pre-wrap"
                  key={`${message.id}-${index}`}
                >
                  {part.text}
                </p>
              );
            }
            return null;
          })}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

function HeroChatDialog({
  chatForm,
  closeChat,
  messages,
  onBackdropClick,
  reducedMotion,
}: {
  chatForm: React.ReactNode;
  closeChat: () => void;
  messages: ReturnType<typeof useChat>["messages"];
  onBackdropClick: () => void;
  reducedMotion: boolean | null;
}): React.ReactElement {
  const dialogTransition = reducedMotion
    ? { duration: 0 }
    : { bounce: 0.08, type: "spring" as const, visualDuration: 0.42 };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100]"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
    >
      <motion.button
        aria-label="Close conversation"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onBackdropClick}
        type="button"
      />

      <div className="pointer-events-none relative flex h-full items-center justify-center p-4 sm:p-6">
        <motion.dialog
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-labelledby="hero-chat-title"
          className={cn(
            dialogShellClass,
            "pointer-events-auto relative min-h-[min(480px,72vh)]"
          )}
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={dialogTransition}
        >
          <div className="flex items-start justify-between gap-4 border-border border-b px-5 py-4">
            <div className="text-left">
              <p
                className="font-heading font-semibold text-foreground text-lg"
                id="hero-chat-title"
              >
                AI Search
              </p>
              <p className="text-muted-foreground text-sm">
                Find and book local services with natural language.
              </p>
            </div>
            <Button
              aria-label="Close"
              onClick={closeChat}
              size="icon-sm"
              variant="ghost"
            >
              <XIcon />
            </Button>
          </div>

          <div className="min-h-[280px] flex-1 overflow-y-auto px-5 py-4">
            <ChatMessages messages={messages} />
          </div>

          <div className="border-border border-t px-5 py-4">{chatForm}</div>
        </motion.dialog>
      </div>
    </motion.div>
  );
}

export function HomeHero(): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const submitPrompt = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) {
        return;
      }

      void sendMessage({ text: trimmed });
      setInput("");
      setIsChatOpen(true);
    },
    [isLoading, sendMessage]
  );

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    function handleCommandPalette(event: KeyboardEvent): void {
      if (event.key.toLowerCase() !== "k") {
        return;
      }
      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }

      event.preventDefault();
      setIsChatOpen((open) => !open);
    }

    window.addEventListener("keydown", handleCommandPalette);
    return () => window.removeEventListener("keydown", handleCommandPalette);
  }, []);

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeChat();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeChat, isChatOpen]);

  const promptForm = (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        submitPrompt(input);
      }}
    >
      <InputGroup className="h-auto rounded-full border border-white/20 bg-black/45 p-1.5 ps-5 shadow-lg ring-0 backdrop-blur-md before:hidden sm:ps-6 dark:border-white/15 dark:bg-black/70 has-[input:focus-visible]:border-white/35 has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-white/15">
        <InputGroupInput
          className="h-10 text-base text-white placeholder:text-white/55 sm:h-10 sm:text-base"
          disabled={isLoading}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Discover — e.g. Show me dentists nearby"
          value={input}
        />
        <InputGroupAddon align="inline-end" className="pe-0 has-[>button]:me-0">
          <Button
            aria-label="Send prompt"
            className="size-10 shrink-0 rounded-full text-white hover:bg-white/15 hover:text-white"
            disabled={isLoading || !input.trim()}
            size="icon-lg"
            type="submit"
            variant="ghost"
          >
            <ArrowUpIcon className="size-4.5" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );

  const chatForm = (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        submitPrompt(input);
      }}
    >
      <InputGroup className="h-auto rounded-full bg-background p-1.5 ps-4 ring-0 shadow-none before:hidden">
        <InputGroupInput
          className="h-10 text-base"
          disabled={isLoading}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Discover..."
          value={input}
        />
        <InputGroupAddon align="inline-end" className="pe-0 has-[>button]:me-0">
          <Button
            aria-label="Send message"
            className="size-10 shrink-0 rounded-full"
            disabled={isLoading || !input.trim()}
            size="icon-lg"
            type="submit"
            variant="ghost"
          >
            <ArrowUpIcon className="size-4.5" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );

  const chatPortal = isMounted
    ? createPortal(
        <AnimatePresence initial={false}>
          {isChatOpen ? (
            <HeroChatDialog
              chatForm={chatForm}
              closeChat={closeChat}
              key="hero-chat"
              messages={messages}
              onBackdropClick={closeChat}
              reducedMotion={reducedMotion}
            />
          ) : null}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      <section className={cn(heroSurfaceClass, "px-6 py-12 sm:px-16 sm:py-20")}>
        <HeroCarousel dimmed={isChatOpen} paused={isChatOpen} />

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center gap-6 text-center">
          <AnimatePresence initial={false}>
            {isChatOpen ? null : (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full flex-col items-center gap-6 text-white"
                exit={{ opacity: 0, y: 12 }}
                initial={{ opacity: 0, y: 12 }}
                key="hero-heading"
                transition={fadeTransition}
              >
                <Badge className="border-white/20 bg-white/10 text-white backdrop-blur-sm">
                  Cal.com side project
                </Badge>

                <div>
                  <h1 className="text-balance font-heading font-semibold text-3xl tracking-tight sm:text-5xl">
                    Discover local services you can book instantly
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/80 sm:text-lg">
                    A no-commission marketplace for dentists, vets, instructors,
                    clubs, and more — powered by Cal.com scheduling links.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {isChatOpen ? null : (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                initial={{ opacity: 0, y: 8 }}
                key="hero-prompt"
                transition={fadeTransition}
              >
                {promptForm}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {isChatOpen ? null : (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
                exit={{ opacity: 0, y: 12 }}
                initial={{ opacity: 0, y: 12 }}
                key="hero-actions"
                transition={fadeTransition}
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                      disabled={isLoading}
                      key={suggestion}
                      onClick={() => submitPrompt(suggestion)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>

                <Button
                  className="border-white/20 bg-transparent text-white hover:bg-white/10"
                  render={<Link href="/" />}
                  size="sm"
                  variant="outline"
                >
                  Browse listings
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {chatPortal}
    </>
  );
}
