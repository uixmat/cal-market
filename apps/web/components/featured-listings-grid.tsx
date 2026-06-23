import Link from "next/link";
import type * as React from "react";

import { ListingsGrid } from "@/components/listings-grid";
import { Button } from "@/components/ui/button";
import type { BrowseListing } from "@/lib/agent-search";

export function FeaturedListingsGrid({
  listings,
}: {
  listings: BrowseListing[];
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <ListingsGrid listings={listings} showFade={false} />

      <div className="flex justify-center">
        <Button render={<Link href="/search" />} size="sm">
          Search with AI
        </Button>
      </div>
    </div>
  );
}
