"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Transition, Variants } from "motion/react";
import { Children, useEffect, useState } from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const defaultVariants: Variants = {
  animate: {
    filter: "blur(0px)",
    opacity: 1,
    y: "0%",
  },
  exit: {
    filter: "blur(1px)",
    opacity: 0,
    transition: { ease: "easeOut" },
    y: "40%",
  },
  initial: { filter: "blur(1px)", opacity: 0, y: "-20%" },
};

type MotionElement = typeof motion.p | typeof motion.span | typeof motion.code;

export interface TextFlipProps {
  as?: MotionElement;
  className?: string;
  children: React.ReactNode;
  interval?: number;
  onIndexChange?: (index: number) => void;
  play?: boolean;
  transition?: Transition;
  variants?: Variants;
}

export function TextFlip({
  as: Component = motion.p,
  children,
  className,
  interval = 2,
  onIndexChange,
  play = true,
  transition = { duration: 0.3 },
  variants = defaultVariants,
}: TextFlipProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    if (!play || items.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((previous) => {
        const next = (previous + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [interval, items.length, onIndexChange, play]);

  return (
    <AnimatePresence initial={false} mode="wait">
      <Component
        animate="animate"
        className={cn("inline-block", className)}
        exit="exit"
        initial="initial"
        key={currentIndex}
        transition={transition}
        variants={variants}
      >
        {items[currentIndex]}
      </Component>
    </AnimatePresence>
  );
}
