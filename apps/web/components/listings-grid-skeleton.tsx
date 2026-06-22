import type * as React from "react";

import { ListingCardSkeleton } from "@/components/listing-card-skeleton";
import { cn } from "@/lib/utils";

export function ListingsGridSkeleton({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}): React.ReactElement {
  return (
    <div className={cn("group/grid relative", className)}>
      <div className="featured-listings-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <ListingCardSkeleton key={`listing-skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
}
