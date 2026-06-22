"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { useCallback, useState } from "react";

import { DiscoverPromptInput } from "@/components/discover-prompt-input";
import { HeroCarousel } from "@/components/home-hero/hero-carousel";
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
  "relative flex min-h-[min(72vh,640px)] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border shadow-[0_1px_5px_-4px_rgba(36,36,36,0.18),0_4px_8px_0_rgba(36,36,36,0.04)] dark:shadow-[0_1px_5px_-4px_rgba(0,0,0,0.5),0_4px_8px_0_rgba(0,0,0,0.2)]";

const fadeTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function HomeHero(): React.ReactElement {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState("");

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
    <section className={cn(heroSurfaceClass, "px-6 py-12 sm:px-16 sm:py-20")}>
      <HeroCarousel />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center gap-6 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col items-center gap-6 text-white"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          transition={fadeTransition}
        >
          <h1 className="text-balance font-heading font-semibold text-3xl tracking-tight sm:text-5xl">
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
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          transition={fadeTransition}
        >
          <DiscoverPromptInput
            onChange={setInput}
            onSubmit={() => submitPrompt(input)}
            value={input}
          />
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          transition={fadeTransition}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
