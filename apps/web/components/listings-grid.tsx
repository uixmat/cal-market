"use client";

import { MotionConfig } from "motion/react";
import type * as React from "react";

import { ListingCard } from "@/components/listing-card";
import type { BrowseListing } from "@/lib/agent-search";
import { cn } from "@/lib/utils";

export function ListingsGrid({
  listings,
  className,
  showFade = true,
}: {
  listings: BrowseListing[];
  className?: string;
  showFade?: boolean;
}): React.ReactElement {
  return (
    <MotionConfig
      transition={{ bounce: 0.1, type: "spring", visualDuration: 0.3 }}
    >
      <div className={cn("group/grid relative", className)}>
        <div className="featured-listings-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              calLink={listing.calLink}
              category={listing.category}
              city={listing.city}
              description={listing.description}
              imageUrl={listing.imageUrl}
              key={listing.id}
              region={listing.region}
              slug={listing.slug}
              title={listing.title}
            />
          ))}
        </div>

        {showFade ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-card to-transparent transition-opacity duration-300 ease-out sm:h-48",
              "max-sm:group-has-[.featured-listings-grid>*:nth-child(n+2):hover]/grid:opacity-0",
              "sm:max-lg:group-has-[.featured-listings-grid>*:nth-child(n+3):hover]/grid:opacity-0",
              "lg:group-has-[.featured-listings-grid>*:nth-child(n+4):hover]/grid:opacity-0"
            )}
          />
        ) : null}
      </div>
    </MotionConfig>
  );
}
