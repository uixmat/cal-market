"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import type * as React from "react";

import { HomeEventsMap } from "@/components/home-events/home-events-map";
import { SectionContainer } from "@/components/layout/section-container";
import { cn } from "@/lib/utils";

const hoverEase = [0.22, 1, 0.36, 1] as const;

const fadeDuration = 0.55;
const textStagger = 0.08;
const gradientFadeDuration = 0.8;

const gradientVariants: Variants = {
  hover: {
    opacity: 0,
    transition: {
      delay: textStagger,
      duration: gradientFadeDuration,
      ease: hoverEase,
    },
  },
  rest: {
    opacity: 1,
    transition: { duration: gradientFadeDuration, ease: hoverEase },
  },
};

const titleVariants: Variants = {
  hover: {
    filter: "blur(2px)",
    opacity: 0,
    transition: { duration: fadeDuration, ease: hoverEase },
    y: 15,
  },
  rest: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { delay: textStagger, duration: fadeDuration, ease: hoverEase },
    y: 0,
  },
};

const eyebrowVariants: Variants = {
  hover: {
    filter: "blur(2px)",
    opacity: 0,
    transition: { delay: textStagger, duration: fadeDuration, ease: hoverEase },
    y: 15,
  },
  rest: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: fadeDuration, ease: hoverEase },
    y: 0,
  },
};

export function HomeEvents(): React.ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <section aria-label="Events happening near you">
      <motion.div
        animate="rest"
        className="relative max-sm:[&_[data-slot=events-overlay]]:hidden"
        initial="rest"
        whileHover={reducedMotion ? undefined : "hover"}
      >
        <SectionContainer
          className={cn(
            "relative overflow-hidden p-0",
            "max-sm:flex max-sm:flex-col",
            "sm:h-[min(480px,70vh)]"
          )}
        >
          <div className="relative z-10 px-6 py-8 max-sm:border-border max-sm:border-b max-sm:bg-background sm:hidden">
            <p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              Today in San Francisco
            </p>
            <h2 className="mt-3 text-balance font-heading font-semibold text-3xl tracking-tight">
              Events happening near you today
            </h2>
          </div>

          <div className="relative h-[280px] sm:absolute sm:inset-0 sm:h-auto">
            <HomeEventsMap />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"
              data-slot="events-overlay"
              variants={gradientVariants}
            />

            <motion.div
              className="pointer-events-none absolute inset-0"
              data-slot="events-overlay"
            >
              <motion.div className="absolute inset-y-0 left-0 z-10 flex max-w-md flex-col justify-center px-12">
                <motion.p
                  className="font-medium text-muted-foreground text-sm uppercase tracking-wide"
                  variants={eyebrowVariants}
                >
                  Today in San Francisco
                </motion.p>
                <motion.h2
                  className="mt-3 text-balance font-heading font-semibold text-3xl tracking-tight sm:text-4xl"
                  variants={titleVariants}
                >
                  Events happening near you today
                </motion.h2>
              </motion.div>
            </motion.div>
          </div>
        </SectionContainer>
      </motion.div>
    </section>
  );
}
