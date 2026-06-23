"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { HERO_SLIDE_DURATION_MS, heroSlides } from "./hero-slides";

interface HeroCarouselProps {
  activeIndex: number;
  dimmed?: boolean;
  onActiveIndexChange: (index: number) => void;
  paused?: boolean;
}

export function HeroCarousel({
  activeIndex,
  dimmed = false,
  onActiveIndexChange,
  paused = false,
}: HeroCarouselProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const goToNext = useCallback(() => {
    onActiveIndexChange((activeIndexRef.current + 1) % heroSlides.length);
  }, [onActiveIndexChange]);

  useEffect(() => {
    if (paused || reducedMotion) {
      return;
    }

    const timer = window.setInterval(goToNext, HERO_SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [goToNext, paused, reducedMotion]);

  const crossfadeDuration = reducedMotion ? 0 : 1.4;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 select-none"
    >
      {heroSlides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.div
            animate={{ opacity: isActive ? 1 : 0 }}
            className="absolute inset-0"
            key={slide.imageUrl}
            style={{ zIndex: isActive ? 2 : 1 }}
            transition={{
              duration: crossfadeDuration,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={
                isActive && !reducedMotion
                  ? {
                      scale: slide.kenBurns.scale,
                      x: slide.kenBurns.x,
                      y: slide.kenBurns.y,
                    }
                  : { scale: 1, x: 0, y: 0 }
              }
              className="absolute inset-[-8%]"
              initial={{ scale: 1, x: 0, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : HERO_SLIDE_DURATION_MS / 1000,
                ease: "linear",
              }}
            >
              <Image
                alt={slide.alt}
                className="object-cover"
                fill
                priority={index === 0}
                sizes="100vw"
                src={slide.imageUrl}
              />
            </motion.div>
          </motion.div>
        );
      })}

      <div
        className={cn(
          "absolute inset-0 z-[3] bg-black/50 transition-opacity duration-300 max-sm:bg-black/60",
          dimmed && "bg-black/65"
        )}
      />
    </div>
  );
}
