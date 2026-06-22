"use client";

import { motion } from "motion/react";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { HERO_SLIDE_DURATION_MS } from "./hero-slides";

const TICKER_DOT_HEIGHT_PX = 8;
const TICKER_DOT_INACTIVE_WIDTH_PX = 8;
const TICKER_DOT_ACTIVE_WIDTH_PX = 32;

const tickerWidthTransition = {
  bounce: 0.2,
  type: "spring" as const,
  visualDuration: 0.35,
};

interface CarouselTickerProps {
  activeIndex: number;
  count: number;
  paused: boolean;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}

export function CarouselTicker({
  activeIndex,
  count,
  paused,
  reducedMotion,
  onSelect,
}: CarouselTickerProps): React.ReactElement {
  const progressDuration = reducedMotion ? 0 : HERO_SLIDE_DURATION_MS / 1000;
  const widthTransition = reducedMotion
    ? { duration: 0 }
    : tickerWidthTransition;

  return (
    <div
      aria-label="Carousel pagination"
      className="flex items-center gap-2"
      role="tablist"
    >
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={isActive}
            className="flex h-4 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            key={index}
            onClick={() => onSelect(index)}
            role="tab"
            type="button"
          >
            <motion.div
              animate={{
                width: isActive
                  ? TICKER_DOT_ACTIVE_WIDTH_PX
                  : TICKER_DOT_INACTIVE_WIDTH_PX,
              }}
              className={cn(
                "relative overflow-hidden rounded-full bg-white/35",
                !isActive && "hover:bg-white/55"
              )}
              initial={false}
              style={{ height: TICKER_DOT_HEIGHT_PX }}
              transition={widthTransition}
            >
              {isActive ? (
                <motion.div
                  animate={{ scaleX: 1 }}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white"
                  initial={{ scaleX: reducedMotion ? 1 : 0 }}
                  key={`${activeIndex}-${paused ? "paused" : "playing"}`}
                  transition={{
                    duration: paused ? 0 : progressDuration,
                    ease: "linear",
                  }}
                />
              ) : null}
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}
