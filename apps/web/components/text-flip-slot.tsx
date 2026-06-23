"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const textVariants: Variants = {
  animate: {
    filter: "blur(0px)",
    opacity: 1,
    y: "0%",
  },
  exit: {
    filter: "blur(1px)",
    opacity: 0,
    transition: { duration: 0.18, ease: "easeOut" },
    y: "35%",
  },
  initial: { filter: "blur(1px)", opacity: 0, y: "-20%" },
};

const textEnterTransition: Transition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
};

const widthTransition: Transition = {
  bounce: 0,
  type: "spring",
  visualDuration: 0.38,
};

interface TextFlipSlotProps {
  className?: string;
  interval?: number;
  play?: boolean;
  words: readonly string[];
}

export function TextFlipSlot({
  className,
  interval = 2.5,
  play = true,
  words,
}: TextFlipSlotProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = play && !reducedMotion && words.length > 1;

  const measureRef = useRef<HTMLSpanElement>(null);
  const hasMeasuredRef = useRef(false);
  const pendingIndexRef = useRef<number | null>(null);
  const isResizingRef = useRef(false);
  const allowEnterAnimationRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(true);
  const [widths, setWidths] = useState<number[]>([]);
  const [animatedWidth, setAnimatedWidth] = useState<number | undefined>();

  const measureWidths = useCallback(() => {
    if (!measureRef.current) {
      return;
    }

    const elements = measureRef.current.querySelectorAll("[data-flip-word]");
    const measured = [...elements].map(
      (element) => element.getBoundingClientRect().width
    );

    if (measured.length === 0 || measured.some((width) => width <= 0)) {
      return;
    }

    setWidths(measured);
    setAnimatedWidth((current) => current ?? measured[0]);
    hasMeasuredRef.current = true;
  }, []);

  useLayoutEffect(() => {
    measureWidths();
  }, [className, measureWidths, words]);

  useEffect(() => {
    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [measureWidths]);

  useEffect(() => {
    pendingIndexRef.current = pendingIndex;
  }, [pendingIndex]);

  const handleExitComplete = useCallback(() => {
    const nextIndex = pendingIndexRef.current;
    if (nextIndex === null || widths[nextIndex] === undefined) {
      return;
    }

    const nextWidth = widths[nextIndex];
    if (nextWidth === animatedWidth) {
      isResizingRef.current = false;
      allowEnterAnimationRef.current = true;
      setIndex(nextIndex);
      setPendingIndex(null);
      pendingIndexRef.current = null;
      setTextVisible(true);
      return;
    }

    isResizingRef.current = true;
    setAnimatedWidth(nextWidth);
  }, [animatedWidth, widths]);

  const handleWidthComplete = useCallback(() => {
    if (!isResizingRef.current) {
      return;
    }

    const nextIndex = pendingIndexRef.current;
    if (nextIndex === null) {
      return;
    }

    isResizingRef.current = false;
    allowEnterAnimationRef.current = true;
    setIndex(nextIndex);
    setPendingIndex(null);
    pendingIndexRef.current = null;
    setTextVisible(true);
  }, []);

  const startFlip = useCallback(() => {
    if (widths.length === 0) {
      return;
    }

    const next = (index + 1) % words.length;
    pendingIndexRef.current = next;
    setPendingIndex(next);
    setTextVisible(false);
  }, [index, widths.length, words.length]);

  useEffect(() => {
    if (!play || words.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      if (reducedMotion) {
        setIndex((current) => {
          const next = (current + 1) % words.length;
          if (widths[next] !== undefined) {
            setAnimatedWidth(widths[next]);
          }
          return next;
        });
        return;
      }

      startFlip();
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [interval, play, reducedMotion, startFlip, widths, words.length]);

  if (words.length === 0) {
    return <span className={className} />;
  }

  const resolvedWidth = animatedWidth ?? widths[index];
  const showAnimatedText = shouldAnimate ? textVisible : true;
  const heightWord = words[pendingIndex ?? index] ?? words[0];
  const widthMotionTransition =
    shouldAnimate && hasMeasuredRef.current ? widthTransition : { duration: 0 };
  const hasResolvedWidth = resolvedWidth !== undefined && resolvedWidth > 0;

  return (
    <span
      aria-live="polite"
      className={cn("inline-block align-bottom", className)}
    >
      <span
        aria-hidden
        className="pointer-events-none invisible absolute h-0 overflow-hidden"
        ref={measureRef}
      >
        {words.map((word) => (
          <span
            className={cn("inline-block whitespace-nowrap", className)}
            data-flip-word
            key={word}
          >
            {word}
          </span>
        ))}
      </span>

      <motion.span
        animate={{ width: hasResolvedWidth ? resolvedWidth : "auto" }}
        className="inline-grid overflow-hidden align-bottom whitespace-nowrap [grid-template-areas:'stack'] *:[grid-area:stack]"
        initial={false}
        onAnimationComplete={() => {
          handleWidthComplete();
        }}
        transition={widthMotionTransition}
      >
        <span aria-hidden className="invisible select-none">
          {heightWord}
        </span>
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={handleExitComplete}
        >
          {showAnimatedText ? (
            <motion.span
              animate="animate"
              className="inline-block"
              exit="exit"
              initial={
                shouldAnimate && allowEnterAnimationRef.current
                  ? "initial"
                  : false
              }
              key={index}
              transition={textEnterTransition}
              variants={textVariants}
            >
              {words[index]}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.span>
    </span>
  );
}
