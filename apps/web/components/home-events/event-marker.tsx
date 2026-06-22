"use client";

import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";
import { useRef } from "react";

import type { NearbyEvent } from "@/components/home-events/events";
import {
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerTooltip,
} from "@/components/ui/map";

interface EventMarkerProps {
  event: NearbyEvent;
  isSelected: boolean;
  onSelect: (event: NearbyEvent, markerElement: HTMLElement) => void;
}

const pulseEase = [0, 0.42, 0.34, 0.98] as const;

function getPulseDelay(id: string): number {
  let hash = 0;
  for (const char of id) {
    hash = (hash + (char.codePointAt(0) ?? 0)) % 100;
  }
  return (hash / 100) * 1.4;
}

export function EventMarker({
  event,
  isSelected,
  onSelect,
}: EventMarkerProps): React.ReactElement {
  const markerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <MapMarker
      latitude={event.latitude}
      longitude={event.longitude}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        const markerElement = markerRef.current;
        if (markerElement) {
          onSelect(event, markerElement);
        }
      }}
    >
      <MarkerContent>
        {isSelected ? (
          <div aria-hidden className="size-5" ref={markerRef} />
        ) : (
          <>
            <div className="relative size-5">
              {reducedMotion ? null : (
                <motion.span
                  animate={{
                    opacity: [0, 0, 0.5, 0, 0],
                    scale: [1, 1, 2.75, 2.75, 1],
                  }}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full border-2 border-white will-change-transform"
                  initial={{ opacity: 0, scale: 1 }}
                  transition={{
                    delay: getPulseDelay(event.id),
                    duration: 5,
                    ease: pulseEase,
                    repeat: Number.POSITIVE_INFINITY,
                    times: [0, 0.05, 0.4, 0.82, 1],
                  }}
                />
              )}
              <motion.div
                ref={markerRef}
                className="relative z-10 size-5 cursor-pointer rounded-full border-2 border-white bg-card shadow-lg"
                transition={{ bounce: 0, duration: 0.3, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
            <MarkerLabel position="bottom">{event.label}</MarkerLabel>
          </>
        )}
      </MarkerContent>
      {isSelected ? null : <MarkerTooltip>{event.name}</MarkerTooltip>}
    </MapMarker>
  );
}
