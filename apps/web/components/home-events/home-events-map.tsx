"use client";

import { AnimatePresence } from "motion/react";
import type * as React from "react";
import { useCallback, useRef, useState } from "react";

import { EventDetailPanel } from "@/components/home-events/event-detail-panel";
import { EventMarker } from "@/components/home-events/event-marker";
import {
  eventsMapCenter,
  eventsMapZoom,
  getMarkerOrigin,
  nearbyEvents,
} from "@/components/home-events/events";
import type {
  MarkerOrigin,
  NearbyEvent,
} from "@/components/home-events/events";
import { Map } from "@/components/ui/map";

interface SelectedEvent {
  event: NearbyEvent;
  origin: MarkerOrigin;
}

export function HomeEventsMap(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<SelectedEvent | null>(null);

  const handleSelect = useCallback(
    (event: NearbyEvent, markerElement: HTMLElement) => {
      const containerElement = containerRef.current;
      if (!containerElement) {
        return;
      }

      setSelected({
        event,
        origin: getMarkerOrigin(markerElement, containerElement),
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div className="relative size-full" ref={containerRef}>
      <Map
        center={eventsMapCenter}
        className="h-full w-full"
        zoom={eventsMapZoom}
      >
        {nearbyEvents.map((event) => (
          <EventMarker
            event={event}
            isSelected={selected?.event.id === event.id}
            key={event.id}
            onSelect={handleSelect}
          />
        ))}
      </Map>

      <AnimatePresence>
        {selected ? (
          <EventDetailPanel
            event={selected.event}
            key={selected.event.id}
            onClose={handleClose}
            origin={selected.origin}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
