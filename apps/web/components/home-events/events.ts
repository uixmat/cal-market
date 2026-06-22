export interface NearbyEvent {
  id: string;
  label: string;
  name: string;
  longitude: number;
  latitude: number;
  time: string;
  venue: string;
  description: string;
}

export const nearbyEvents: NearbyEvent[] = [
  {
    description:
      "Local produce, artisan goods, and ready-to-eat bites every Saturday morning.",
    id: "ferry-market",
    label: "Market",
    latitude: 37.7955,
    longitude: -122.3933,
    name: "Ferry Building Farmers Market",
    time: "Today · 9:00 AM – 2:00 PM",
    venue: "Ferry Building, Embarcadero",
  },
  {
    description:
      "All-levels outdoor flow class — bring a mat and book your spot via Cal.com.",
    id: "yoga-mission",
    label: "Fitness",
    latitude: 37.7599,
    longitude: -122.4194,
    name: "Mission District yoga pop-up",
    time: "Today · 6:30 PM",
    venue: "Mission Dolores Park",
  },
  {
    description:
      "Intimate evening sets from local artists. Limited capacity — reserve ahead.",
    id: "live-music",
    label: "Music",
    latitude: 37.7842,
    longitude: -122.4331,
    name: "Fillmore live music night",
    time: "Today · 8:00 PM",
    venue: "The Fillmore, Western Addition",
  },
];

export const eventsMapCenter: [number, number] = [-122.4194, 37.7749];

export const eventsMapZoom = 12;

export interface MarkerOrigin {
  x: number;
  y: number;
  size: number;
}

export function getMarkerOrigin(
  markerElement: HTMLElement,
  containerElement: HTMLElement
): MarkerOrigin {
  const rect = markerElement.getBoundingClientRect();
  const containerRect = containerElement.getBoundingClientRect();

  return {
    size: rect.width,
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top + rect.height / 2,
  };
}
