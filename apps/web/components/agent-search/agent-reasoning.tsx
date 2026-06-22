"use client";

import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Shimmer } from "@/components/agent-search/shimmer";
import { MarkdownContent } from "@/components/markdown-content";
import { cn } from "@/lib/utils";

const MS_IN_S = 1000;

function getThinkingMessage(
  isStreaming: boolean,
  duration: number | undefined
): React.ReactNode {
  if (isStreaming) {
    return <Shimmer>Searching listings…</Shimmer>;
  }

  if (duration === undefined) {
    return "Response";
  }

  return `Response · ${duration}s`;
}

export function AgentReasoningResponse({
  className,
  isStreaming,
  responseKey,
  text,
}: {
  className?: string;
  isStreaming: boolean;
  responseKey: string;
  text: string;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(true);
  const [duration, setDuration] = useState<number | undefined>();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setIsOpen(true);
    setDuration(undefined);
    startTimeRef.current = null;
  }, [responseKey]);

  useEffect(() => {
    if (isStreaming) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }
      return;
    }

    if (startTimeRef.current !== null) {
      setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S));
      startTimeRef.current = null;
    }
  }, [isStreaming]);

  const hasText = text.length > 0;
  const canToggle = hasText || isStreaming;

  return (
    <div className={cn("not-prose w-full", className)}>
      <button
        className="flex min-h-5 w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
        disabled={!canToggle}
        onClick={() => {
          if (!canToggle) {
            return;
          }
          setIsOpen((open) => !open);
        }}
        type="button"
      >
        <BrainIcon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 text-left">
          {getThinkingMessage(isStreaming, duration)}
        </span>
        {canToggle ? (
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 transition-transform duration-200 ease-out",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        ) : null}
      </button>

      {isOpen && hasText ? (
        <div className="mt-3 text-pretty text-muted-foreground text-sm leading-relaxed sm:text-base">
          <MarkdownContent>{text}</MarkdownContent>
        </div>
      ) : null}
    </div>
  );
}
