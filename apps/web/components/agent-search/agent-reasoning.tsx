"use client";

import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type * as React from "react";
import { useEffect, useRef, useState } from "react";

import { Shimmer } from "@/components/agent-search/shimmer";
import { MarkdownContent } from "@/components/markdown-content";
import { cn } from "@/lib/utils";

const COLLAPSED_MAX_HEIGHT = "8.125rem";
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
  const [isContentOpen, setIsContentOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [duration, setDuration] = useState<number | undefined>();
  const contentRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setIsContentOpen(true);
    setIsExpanded(false);
  }, [responseKey]);

  useEffect(() => {
    if (isStreaming) {
      setIsContentOpen(true);
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

  useEffect(() => {
    const element = contentRef.current;
    if (!element || isExpanded || !isContentOpen) {
      return;
    }

    const measureOverflow = (): void => {
      setHasOverflow(element.scrollHeight > element.clientHeight + 1);
    };

    measureOverflow();

    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [isContentOpen, isExpanded, text]);

  const hasText = text.length > 0;
  const showFade =
    isContentOpen && !isExpanded && (hasOverflow || (isStreaming && hasText));
  const canToggleExpanded = isContentOpen && hasText;

  return (
    <div className={cn("not-prose w-full", className)}>
      <button
        className="flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
        onClick={() => {
          if (!hasText && !isStreaming) {
            return;
          }
          setIsContentOpen((open) => {
            if (open) {
              setIsExpanded(false);
            }
            return !open;
          });
        }}
        type="button"
      >
        <BrainIcon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 text-left">
          {getThinkingMessage(isStreaming, duration)}
        </span>
        {hasText ? (
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 transition-transform duration-200 ease-out",
              isContentOpen ? "rotate-180" : "rotate-0"
            )}
          />
        ) : null}
      </button>

      {isContentOpen && (hasText || isStreaming) ? (
        <button
          aria-expanded={isExpanded}
          className={cn(
            "relative mt-3 w-full rounded-lg text-left transition-colors duration-200 ease-out",
            canToggleExpanded && "cursor-pointer hover:bg-muted/30"
          )}
          onClick={() => {
            if (canToggleExpanded) {
              setIsExpanded((expanded) => !expanded);
            }
          }}
          type="button"
        >
          <div
            className={cn(
              "text-pretty text-muted-foreground text-sm leading-relaxed transition-[max-height] duration-300 ease-out sm:text-base",
              !isExpanded && "overflow-hidden"
            )}
            ref={contentRef}
            style={isExpanded ? undefined : { maxHeight: COLLAPSED_MAX_HEIGHT }}
          >
            {hasText ? <MarkdownContent>{text}</MarkdownContent> : null}
          </div>

          {showFade ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card to-transparent transition-opacity duration-300 ease-out"
            />
          ) : null}
        </button>
      ) : null}
    </div>
  );
}
