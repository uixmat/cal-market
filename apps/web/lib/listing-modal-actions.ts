"use server";

import { getListingBySlug } from "@cal-market/agent-core";

import type { ListingDetailData } from "@/components/listing-detail/listing-detail-content";

export async function fetchListingForModal(
  slug: string
): Promise<ListingDetailData | null> {
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return null;
  }

  return {
    calLink: listing.calLink,
    category: listing.category,
    city: listing.city,
    description: listing.description,
    imageUrl: listing.imageUrl,
    region: listing.region,
    slug: listing.slug,
    title: listing.title,
  };
}
