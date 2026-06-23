"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

export const heroPromptPhrases = [
  "Show me dentists nearby",
  "Find ski instructors in Tahoe",
  "Show me veterinarians in Oakland",
  "Book a massage nearby",
] as const;

const typeIntervalMs = 42;
const deleteIntervalMs = 24;
const pauseAfterTypeMs = 2200;
const pauseAfterDeleteMs = 400;
const reducedMotionIntervalMs = 3200;

function useTypingPlaceholder(
  phrases: readonly string[],
  enabled: boolean
): string {
  const reducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState("");
  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    if (!enabled || phrases.length === 0) {
      setDisplayText("");
      return;
    }

    phraseIndexRef.current = 0;
    charIndexRef.current = 0;
    deletingRef.current = false;

    if (reducedMotion) {
      let index = 0;
      setDisplayText(phrases[0] ?? "");

      const intervalId = setInterval(() => {
        index = (index + 1) % phrases.length;
        setDisplayText(phrases[index] ?? "");
      }, reducedMotionIntervalMs);

      return () => clearInterval(intervalId);
    }

    let cancelled = false;
    let timeoutId = 0;

    const schedule = (delay: number, step: () => void) => {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          step();
        }
      }, delay);
    };

    const tick = () => {
      const phrase = phrases[phraseIndexRef.current] ?? "";

      if (!deletingRef.current) {
        if (charIndexRef.current < phrase.length) {
          charIndexRef.current += 1;
          setDisplayText(phrase.slice(0, charIndexRef.current));
          schedule(typeIntervalMs, tick);
          return;
        }

        deletingRef.current = true;
        schedule(pauseAfterTypeMs, tick);
        return;
      }

      if (charIndexRef.current > 0) {
        charIndexRef.current -= 1;
        setDisplayText(phrase.slice(0, charIndexRef.current));
        schedule(deleteIntervalMs, tick);
        return;
      }

      deletingRef.current = false;
      phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length;
      schedule(pauseAfterDeleteMs, tick);
    };

    tick();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [enabled, phrases, reducedMotion]);

  return displayText;
}

export const promptInputOverlayClassName =
  "pointer-events-none absolute inset-0 h-10 overflow-hidden ps-1 text-left text-base leading-10 sm:ps-1.5";

export const promptInputFieldClassName =
  "[&_[data-slot=input]]:h-10 [&_[data-slot=input]]:w-full [&_[data-slot=input]]:min-w-0 [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:px-0 [&_[data-slot=input]]:ps-1 [&_[data-slot=input]]:text-left [&_[data-slot=input]]:text-base [&_[data-slot=input]]:leading-10 [&_[data-slot=input]]:text-white sm:[&_[data-slot=input]]:ps-1.5";

export function TypingPlaceholderOverlay({
  active,
  className,
  phrases,
  prefix = "Ask Discover — ",
}: {
  active: boolean;
  className?: string;
  phrases?: readonly string[];
  prefix?: string;
}): React.ReactElement | null {
  const resolvedPhrases = phrases ?? heroPromptPhrases;
  const displayText = useTypingPlaceholder(resolvedPhrases, active);

  if (!active) {
    return null;
  }

  return (
    <div aria-hidden className={cn(promptInputOverlayClassName, className)}>
      <span className="block truncate text-white/55">
        {prefix ? <span className="max-sm:hidden">{prefix}</span> : null}
        {displayText}
        <span
          aria-hidden
          className="motion-safe:animate-pulse ms-px inline-block w-px translate-y-px bg-current align-middle"
          style={{ height: "1em" }}
        />
      </span>
    </div>
  );
}
