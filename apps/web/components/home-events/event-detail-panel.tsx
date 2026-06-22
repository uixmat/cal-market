"use client";

import { ClockIcon, MapPinIcon, XIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import type * as React from "react";
import { useEffect } from "react";

import type {
  MarkerOrigin,
  NearbyEvent,
} from "@/components/home-events/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Strong ease-out — decelerates smoothly into the final frame */
const smoothEaseOut = [0, 0.42, 0.34, 0.98] as const;

const panelSpring: Transition = {
  borderRadius: { duration: 0.16, ease: smoothEaseOut },
  bounce: 0,
  duration: 0.4,
  type: "spring",
};

const contentBaseDelay = 0.28;
const contentOverlapDelay = 0.09;
const contentDuration = 0.32;

const contentHidden = {
  filter: "blur(1px)",
  opacity: 0,
  y: -10,
};

const contentExit = {
  filter: "blur(1px)",
  opacity: 0,
  transition: {
    duration: 0.15,
    ease: smoothEaseOut,
  },
  y: -10,
};

const contentPrimaryVariants = {
  exit: contentExit,
  hidden: contentHidden,
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      delay: contentBaseDelay,
      duration: contentDuration,
      ease: smoothEaseOut,
    },
    y: 0,
  },
};

const contentSecondaryVariants = {
  exit: contentExit,
  hidden: contentHidden,
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      delay: contentBaseDelay + contentOverlapDelay,
      duration: contentDuration,
      ease: smoothEaseOut,
    },
    y: 0,
  },
};

interface EventDetailPanelProps {
  event: NearbyEvent;
  origin: MarkerOrigin;
  onClose: () => void;
}

function getCollapsedStyle(origin: MarkerOrigin) {
  return {
    borderRadius: 9999,
    bottom: "auto" as const,
    height: origin.size,
    left: origin.x,
    top: origin.y,
    width: origin.size,
    x: "-50%",
    y: "-50%",
  };
}

const expandedStyle = {
  borderRadius: 24,
  bottom: 20,
  height: "auto" as const,
  left: "50%",
  top: "auto" as const,
  width: "min(400px, calc(100% - 40px))",
  x: "-50%",
  y: 0,
};

export function EventDetailPanel({
  event,
  origin,
  onClose,
}: EventDetailPanelProps): React.ReactElement {
  const reducedMotion = useReducedMotion();
  const collapsed = getCollapsedStyle(origin);

  useEffect(() => {
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="pointer-events-none absolute inset-0 z-20"
      exit={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <motion.div
        animate={{ opacity: 1 }}
        className="pointer-events-auto absolute inset-0 bg-black/50 backdrop-blur-[3px]"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
        transition={{ duration: 0.25, ease: smoothEaseOut }}
      />

      <motion.div
        animate={expandedStyle}
        aria-labelledby={`event-detail-${event.id}-title`}
        aria-modal="true"
        className={cn(
          "pointer-events-auto absolute overflow-clip border border-border bg-card shadow-lg",
          "will-change-transform"
        )}
        exit={reducedMotion ? { opacity: 0 } : collapsed}
        initial={reducedMotion ? { opacity: 0, ...expandedStyle } : collapsed}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        // motion.div required for expand animation; semantic dialog not compatible
        role="dialog"
        transition={panelSpring}
      >
        <div className="relative p-5">
          <Button
            aria-label="Close event details"
            className="absolute top-3 right-3"
            onClick={onClose}
            size="icon-sm"
            variant="ghost"
          >
            <XIcon />
          </Button>

          <div className="flex flex-col gap-3 pr-8">
            <motion.div
              animate="visible"
              className="flex flex-col gap-3"
              exit="exit"
              initial={reducedMotion ? "visible" : "hidden"}
              variants={contentPrimaryVariants}
            >
              <Badge className="w-fit" size="sm" variant="secondary">
                {event.label}
              </Badge>

              <h3
                className="font-heading font-semibold text-foreground text-lg leading-tight tracking-tight"
                id={`event-detail-${event.id}-title`}
              >
                {event.name}
              </h3>
            </motion.div>

            <motion.div
              animate="visible"
              className="flex flex-col gap-2"
              exit="exit"
              initial={reducedMotion ? "visible" : "hidden"}
              variants={contentSecondaryVariants}
            >
              <p className="flex items-center gap-2 text-muted-foreground text-sm">
                <ClockIcon aria-hidden className="size-4 shrink-0" />
                {event.time}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPinIcon aria-hidden className="size-4 shrink-0" />
                {event.venue}
              </p>

              <p className="text-pretty text-muted-foreground text-sm leading-relaxed">
                {event.description}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
