"use client";

import { useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { useCallback, useState } from "react";

import { DiscoverPromptInput } from "@/components/discover-prompt-input";
import { CarouselTicker } from "@/components/home-hero/carousel-ticker";
import { HeroCarousel } from "@/components/home-hero/hero-carousel";
import { heroSlides } from "@/components/home-hero/hero-slides";
import { TextFlipSlot } from "@/components/text-flip-slot";
import { Button } from "@/components/ui/button";
import { heroFlipWords } from "@/lib/flip-words";
import { cn } from "@/lib/utils";

const suggestions = [
  "Show me dentists nearby",
  "Find ski instructors in Tahoe",
  "Show me veterinarians in Oakland",
];

const heroSurfaceClass =
  "isolate relative flex min-h-[72dvh] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border shadow-[0_1px_5px_-4px_rgba(36,36,36,0.18),0_4px_8px_0_rgba(36,36,36,0.04)] sm:min-h-[min(72vh,640px)] dark:shadow-[0_1px_5px_-4px_rgba(0,0,0,0.5),0_4px_8px_0_rgba(0,0,0,0.2)]";

export function HomeHero(): React.ReactElement {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const submitPrompt = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [router]
  );

  return (
    <section className={cn(heroSurfaceClass, "px-4 py-10 sm:px-16 sm:py-20")}>
      <HeroCarousel
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />

      <div className="relative z-[1] flex w-full max-w-3xl flex-col items-center justify-center gap-5 text-center sm:gap-6">
        <div className="flex w-full flex-col items-center gap-5 text-white sm:gap-6">
          <h1 className="text-balance font-heading font-semibold text-3xl tracking-tight drop-shadow-sm sm:text-5xl">
            <span className="block">
              Discover local{" "}
              <TextFlipSlot
                className="text-white"
                interval={2.75}
                play
                words={heroFlipWords}
              />
            </span>
            <span className="block">you can book instantly</span>
          </h1>
        </div>

        <div className="w-full max-w-2xl">
          <DiscoverPromptInput
            onChange={setInput}
            onSubmit={() => submitPrompt(input)}
            value={input}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((suggestion) => (
              <Button
                className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
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
        </div>
      </div>

      <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-[2] flex justify-center sm:bottom-6">
        <CarouselTicker
          activeIndex={activeIndex}
          count={heroSlides.length}
          onSelect={setActiveIndex}
          paused={false}
          reducedMotion={Boolean(reducedMotion)}
        />
      </div>
    </section>
  );
}
