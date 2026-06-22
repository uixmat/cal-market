export const HERO_SLIDE_DURATION_MS = 6000;

export interface HeroSlide {
  alt: string;
  imageUrl: string;
  kenBurns: {
    scale: number;
    x: string;
    y: string;
  };
}

export const heroSlides: HeroSlide[] = [
  {
    alt: "Dental clinic interior",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80",
    kenBurns: { scale: 1.12, x: "-3%", y: "-2%" },
  },
  {
    alt: "Person with their dog at the vet",
    imageUrl:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80",
    kenBurns: { scale: 1.1, x: "2%", y: "-3%" },
  },
  {
    alt: "Dance class in a studio",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80",
    kenBurns: { scale: 1.14, x: "-2%", y: "1%" },
  },
  {
    alt: "Ski instructor on the slopes",
    imageUrl:
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1920&q=80",
    kenBurns: { scale: 1.11, x: "3%", y: "-1%" },
  },
  {
    alt: "Modern gym interior",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80",
    kenBurns: { scale: 1.13, x: "-1%", y: "-2%" },
  },
  {
    alt: "Swimming pool lanes",
    imageUrl:
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1920&q=80",
    kenBurns: { scale: 1.1, x: "2%", y: "2%" },
  },
];
