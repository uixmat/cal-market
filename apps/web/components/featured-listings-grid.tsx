import Link from "next/link";
import type * as React from "react";

import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeaturedListing {
  category: string;
  city: string;
  description: string;
  id: string;
  imageUrl: string;
  slug: string;
  title: string;
}

export function FeaturedListingsGrid({
  listings,
}: {
  listings: FeaturedListing[];
}): React.ReactElement {
  return (
    <div className="group/grid flex flex-col gap-6">
      <div className="relative">
        <div className="featured-listings-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-card to-transparent transition-opacity duration-300 ease-out sm:h-48",
            "max-sm:group-has-[.featured-listings-grid>*:nth-child(n+2):hover]/grid:opacity-0",
            "sm:max-lg:group-has-[.featured-listings-grid>*:nth-child(n+3):hover]/grid:opacity-0",
            "lg:group-has-[.featured-listings-grid>*:nth-child(n+4):hover]/grid:opacity-0"
          )}
        />
      </div>

      <div className="flex justify-center">
        <Button render={<Link href="/" />} size="sm">
          Browse
        </Button>
      </div>
    </div>
  );
}
