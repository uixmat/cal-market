"use client";

import { motion } from "motion/react";
import type * as React from "react";

import { cn } from "@/lib/utils";

import { HERO_SLIDE_DURATION_MS } from "./hero-slides";

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
  const duration = reducedMotion ? 0 : HERO_SLIDE_DURATION_MS / 1000;

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
            {isActive ? (
              <motion.div
                className="relative h-2 w-8 overflow-hidden rounded-full bg-white/35"
                layoutId="hero-carousel-ticker"
                transition={{
                  bounce: 0.2,
                  type: "spring",
                  visualDuration: 0.35,
                }}
              >
                <motion.div
                  animate={{ scaleX: paused || reducedMotion ? 1 : 1 }}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white"
                  initial={{ scaleX: reducedMotion ? 1 : 0 }}
                  key={`${activeIndex}-${paused ? "paused" : "playing"}`}
                  transition={{
                    duration: paused ? 0 : duration,
                    ease: "linear",
                  }}
                />
              </motion.div>
            ) : (
              <span
                className={cn(
                  "block size-2 rounded-full bg-white/35 transition-colors",
                  "hover:bg-white/55"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
