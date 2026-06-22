export interface HomeCategory {
  alt: string;
  href: string;
  imageUrl: string;
  title: string;
}

export const homeCategories: HomeCategory[] = [
  {
    alt: "Dental clinic interior",
    href: "/search?q=Show+me+medical+services+nearby",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
    title: "Medical",
  },
  {
    alt: "Person with their dog at the vet",
    href: "/search?q=Show+me+veterinarians+nearby",
    imageUrl:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
    title: "Pets",
  },
  {
    alt: "Modern gym interior",
    href: "/search?q=Find+sports+and+fitness+nearby",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    title: "Sports",
  },
  {
    alt: "Dance class in a studio",
    href: "/search?q=Find+dance+classes+nearby",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    title: "Dance",
  },
  {
    alt: "People at a community workshop",
    href: "/search?q=Find+social+clubs+nearby",
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    title: "Social",
  },
];
