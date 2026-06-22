import { getFeaturedListings } from "@cal-market/agent-core";
import Link from "next/link";

import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await getFeaturedListings(12);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-muted-foreground text-sm uppercase tracking-wide">
            Cal.com side project
          </p>
          <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">
            Discover local services you can book instantly
          </h1>
          <p className="mt-3 text-muted-foreground">
            A no-commission marketplace for dentists, vets, instructors, clubs,
            and more — powered by Cal.com scheduling links.
          </p>
        </div>
        <Button render={<Link href="/search" />} size="lg">
          Try AI search
        </Button>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-semibold text-xl">Featured listings</h2>
          <p className="text-muted-foreground text-sm">
            {listings.length} services
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              category={listing.category}
              city={listing.city}
              description={listing.description}
              imageUrl={listing.imageUrl}
              key={listing.id}
              slug={listing.slug}
              title={listing.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
