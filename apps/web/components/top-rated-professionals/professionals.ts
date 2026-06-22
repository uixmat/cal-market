export interface TopRatedProfessional {
  availability: string;
  avatarUrl: string;
  calLink: string;
  city: string;
  id: string;
  name: string;
  price: string;
  priceUnit: string;
  rating: number;
  region: string;
  reviewCount: number;
  tags: TopRatedProfessionalTag[];
  title: string;
  verified: boolean;
}

export interface TopRatedProfessionalTag {
  icon?: "video";
  label: string;
}

export const topRatedProfessionals: TopRatedProfessional[] = [
  {
    availability: "Available now",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&q=80",
    calLink: "https://cal.com/james-liu-tutor",
    city: "Boston",
    id: "james-liu",
    name: "James Liu",
    price: "$75",
    priceUnit: "1h",
    rating: 5,
    region: "MA",
    reviewCount: 203,
    tags: [
      { label: "Free intro call" },
      { icon: "video", label: "Remote" },
      { label: "Accepting clients" },
    ],
    title: "Math & Physics Tutor",
    verified: true,
  },
  {
    availability: "Within 3 days",
    avatarUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop&q=80",
    calLink: "https://cal.com/dr-sarah-chen",
    city: "San Francisco",
    id: "sarah-chen",
    name: "Dr. Sarah Chen",
    price: "$150",
    priceUnit: "50 min",
    rating: 4.9,
    region: "CA",
    reviewCount: 127,
    tags: [
      { label: "Free intro call" },
      { icon: "video", label: "Remote" },
      { label: "Accepting clients" },
    ],
    title: "Licensed Clinical Psychologist",
    verified: true,
  },
  {
    availability: "Today",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&q=80",
    calLink: "https://cal.com/david-park-sales",
    city: "San Francisco",
    id: "david-park",
    name: "David Park",
    price: "Free",
    priceUnit: "30 min",
    rating: 4.9,
    region: "CA",
    reviewCount: 156,
    tags: [
      { label: "Free intro call" },
      { icon: "video", label: "Remote" },
      { label: "Accepting clients" },
    ],
    title: "Senior Enterprise Sales Coach",
    verified: true,
  },
  {
    availability: "Today",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&q=80",
    calLink: "https://cal.com/rachel-green-fitness",
    city: "Denver",
    id: "rachel-green",
    name: "Rachel Green",
    price: "$80",
    priceUnit: "1h",
    rating: 4.9,
    region: "CO",
    reviewCount: 187,
    tags: [{ label: "Free intro call" }, { label: "Accepting clients" }],
    title: "Personal Fitness Trainer",
    verified: true,
  },
];
