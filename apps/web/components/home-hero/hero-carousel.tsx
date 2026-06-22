"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { CarouselTicker } from "./carousel-ticker";
import { HERO_SLIDE_DURATION_MS, heroSlides } from "./hero-slides";

interface HeroCarouselProps {
  dimmed?: boolean;
  paused?: boolean;
}

export function HeroCarousel({
  dimmed = false,
  paused = false,
}: HeroCarouselProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) {
      return;
    }

    const timer = window.setInterval(goToNext, HERO_SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [activeIndex, goToNext, paused, reducedMotion]);

  const crossfadeDuration = reducedMotion ? 0 : 1.4;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
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
                alt=""
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
          "absolute inset-0 z-[3] bg-black/50 transition-opacity duration-300",
          dimmed && "bg-black/65"
        )}
      />

      <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-[4] flex justify-center">
        <CarouselTicker
          activeIndex={activeIndex}
          count={heroSlides.length}
          onSelect={setActiveIndex}
          paused={paused}
          reducedMotion={Boolean(reducedMotion)}
        />
      </div>
    </div>
  );
}
