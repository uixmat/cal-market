import path from "node:path";

import { config } from "dotenv";

const monorepoRoot = path.resolve(import.meta.dirname, "../../..");

config({ path: path.resolve(monorepoRoot, ".env") });
config({ path: path.resolve(monorepoRoot, ".env.local") });
config({ override: true, path: path.resolve(monorepoRoot, "apps/web/.env") });

const { db } = await import("./client");
const { listings } = await import("./schema/listings");

const seedListings = [
  {
    calLink: "https://cal.com/bright-smile-dental",
    category: "dentist",
    city: "San Francisco",
    description:
      "Family-friendly dental clinic offering cleanings, whitening, and emergency care.",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
    lat: 37.7749,
    lng: -122.4194,
    region: "CA",
    slug: "bright-smile-dental",
    title: "Bright Smile Dental",
  },
  {
    calLink: "https://cal.com/bay-area-orthodontics",
    category: "dentist",
    city: "San Francisco",
    description: "Invisalign and braces for teens and adults in downtown SF.",
    imageUrl:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80",
    lat: 37.7849,
    lng: -122.4094,
    region: "CA",
    slug: "bay-area-orthodontics",
    title: "Bay Area Orthodontics",
  },
  {
    calLink: "https://cal.com/mission-pet-clinic",
    category: "veterinarian",
    city: "San Francisco",
    description:
      "Veterinary care for dogs and cats with same-week appointments.",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
    lat: 37.7599,
    lng: -122.4148,
    region: "CA",
    slug: "mission-pet-clinic",
    title: "Mission Pet Clinic",
  },
  {
    calLink: "https://cal.com/paws-and-claws-vet",
    category: "veterinarian",
    city: "Oakland",
    description:
      "Holistic vet services including wellness exams and nutrition.",
    imageUrl:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
    lat: 37.8044,
    lng: -122.2712,
    region: "CA",
    slug: "paws-and-claws-vet",
    title: "Paws & Claws Veterinary",
  },
  {
    calLink: "https://cal.com/marina-family-medicine",
    category: "doctor",
    city: "San Francisco",
    description: "Primary care physician accepting new patients in the Marina.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    lat: 37.8021,
    lng: -122.4416,
    region: "CA",
    slug: "marina-family-medicine",
    title: "Marina Family Medicine",
  },
  {
    calLink: "https://cal.com/telehealth-plus",
    category: "doctor",
    city: "San Francisco",
    description:
      "Virtual doctor visits for common illnesses and prescriptions.",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    lat: 37.7749,
    lng: -122.4194,
    region: "CA",
    slug: "telehealth-plus",
    title: "TeleHealth Plus",
  },
  {
    calLink: "https://cal.com/salsa-social-club",
    category: "dance",
    city: "San Francisco",
    description: "Weekly salsa nights and beginner-friendly group classes.",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    lat: 37.7699,
    lng: -122.4469,
    region: "CA",
    slug: "salsa-social-club",
    title: "Salsa Social Club",
  },
  {
    calLink: "https://cal.com/ballet-academy-sf",
    category: "dance",
    city: "San Francisco",
    description: "Classical ballet training for children and adult beginners.",
    imageUrl:
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&q=80",
    lat: 37.781,
    lng: -122.404,
    region: "CA",
    slug: "ballet-academy-sf",
    title: "Ballet Academy SF",
  },
  {
    calLink: "https://cal.com/marin-mtb-guides",
    category: "mountain-biking",
    city: "Sausalito",
    description: "Guided mountain bike rides through Marin Headlands trails.",
    imageUrl:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
    lat: 37.8591,
    lng: -122.4853,
    region: "CA",
    slug: "marin-mtb-guides",
    title: "Marin MTB Guides",
  },
  {
    calLink: "https://cal.com/tahoe-ski-school",
    category: "ski-snowboard",
    city: "South Lake Tahoe",
    description: "Private ski and snowboard lessons for all skill levels.",
    imageUrl:
      "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
    lat: 38.9547,
    lng: -119.9772,
    region: "CA",
    slug: "tahoe-ski-school",
    title: "Tahoe Ski School",
  },
  {
    calLink: "https://cal.com/sf-tennis-club",
    category: "sports",
    city: "San Francisco",
    description: "Court rentals and coaching for recreational players.",
    imageUrl:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
    lat: 37.7694,
    lng: -122.4862,
    region: "CA",
    slug: "sf-tennis-club",
    title: "SF Tennis Club",
  },
  {
    calLink: "https://cal.com/crossfit-mission",
    category: "sports",
    city: "San Francisco",
    description:
      "Small-group strength and conditioning with certified coaches.",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    lat: 37.7599,
    lng: -122.4148,
    region: "CA",
    slug: "crossfit-mission",
    title: "CrossFit Mission",
  },
  {
    calLink: "https://cal.com/sunset-yoga-collective",
    category: "fitness",
    city: "San Francisco",
    description:
      "Outdoor vinyasa and restorative yoga sessions at Ocean Beach.",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    lat: 37.7596,
    lng: -122.5107,
    region: "CA",
    slug: "sunset-yoga-collective",
    title: "Sunset Yoga Collective",
  },
  {
    calLink: "https://cal.com/book-club-cafe",
    category: "social-club",
    city: "San Francisco",
    description:
      "Monthly book discussions over coffee in a cozy neighborhood cafe.",
    imageUrl:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
    lat: 37.7615,
    lng: -122.4241,
    region: "CA",
    slug: "book-club-cafe",
    title: "Book Club Cafe",
  },
  {
    calLink: "https://cal.com/makers-workshop",
    category: "social-club",
    city: "Oakland",
    description: "Hands-on woodworking and electronics classes for hobbyists.",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    lat: 37.8044,
    lng: -122.2712,
    region: "CA",
    slug: "makers-workshop",
    title: "Makers Workshop",
  },
  {
    calLink: "https://cal.com/oakland-dental-care",
    category: "dentist",
    city: "Oakland",
    description: "Affordable dental services with evening appointment slots.",
    imageUrl:
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&q=80",
    lat: 37.8044,
    lng: -122.2712,
    region: "CA",
    slug: "oakland-dental-care",
    title: "Oakland Dental Care",
  },
  {
    calLink: "https://cal.com/peninsula-vet-hospital",
    category: "veterinarian",
    city: "Palo Alto",
    description: "Full-service animal hospital with surgical and dental care.",
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    lat: 37.4419,
    lng: -122.143,
    region: "CA",
    slug: "peninsula-vet-hospital",
    title: "Peninsula Vet Hospital",
  },
  {
    calLink: "https://cal.com/rock-climbing-gym-sf",
    category: "sports",
    city: "San Francisco",
    description:
      "Bouldering and top-rope sessions with intro classes for beginners.",
    imageUrl:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80",
    lat: 37.768,
    lng: -122.3877,
    region: "CA",
    slug: "rock-climbing-gym-sf",
    title: "Rock Climbing Gym SF",
  },
  {
    calLink: "https://cal.com/swim-coach-marin",
    category: "sports",
    city: "San Rafael",
    description: "Private swim lessons for kids and adults at local pools.",
    imageUrl:
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
    lat: 37.9735,
    lng: -122.5311,
    region: "CA",
    slug: "swim-coach-marin",
    title: "Swim Coach Marin",
  },
  {
    calLink: "https://cal.com/photography-walks",
    category: "social-club",
    city: "San Francisco",
    description:
      "Guided street photography tours through iconic neighborhoods.",
    imageUrl:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    lat: 37.7955,
    lng: -122.3937,
    region: "CA",
    slug: "photography-walks",
    title: "SF Photography Walks",
  },
] as const;

const seed = async (): Promise<void> => {
  console.log("Seeding listings...");

  await Promise.all(
    seedListings.map((listing) =>
      db
        .insert(listings)
        .values(listing)
        .onConflictDoUpdate({
          set: {
            calLink: listing.calLink,
            category: listing.category,
            city: listing.city,
            description: listing.description,
            imageUrl: listing.imageUrl,
            lat: listing.lat,
            lng: listing.lng,
            region: listing.region,
            title: listing.title,
          },
          target: listings.slug,
        })
    )
  );

  const count = await db.select().from(listings);
  console.log(`Seeded ${count.length} listings.`);
};

await seed();
