"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import type * as React from "react";

import type { ListingDetailData } from "@/components/listing-detail/listing-detail-content";
import { ListingDetailModal } from "@/components/listing-detail/listing-detail-modal";
import { fetchListingForModal } from "@/lib/listing-modal-actions";
import { peekListingForModal } from "@/lib/listing-modal-cache";

export function ListingDetailModalRoute({
  slug,
}: {
  slug: string;
}): React.ReactElement | null {
  const [listing, setListing] = useState<ListingDetailData | null>(() =>
    peekListingForModal(slug)
  );
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (listing) {
      return;
    }

    let cancelled = false;

    async function loadListing(): Promise<void> {
      try {
        const fetched = await fetchListingForModal(slug);

        if (cancelled) {
          return;
        }

        if (!fetched) {
          setMissing(true);
          return;
        }

        setListing(fetched);
      } catch {
        if (!cancelled) {
          setMissing(true);
        }
      }
    }

    void loadListing();

    return () => {
      cancelled = true;
    };
  }, [listing, slug]);

  if (missing) {
    notFound();
  }

  if (!listing) {
    return null;
  }

  return <ListingDetailModal listing={listing} slug={slug} />;
}
