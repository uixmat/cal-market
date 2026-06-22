import { db, listings } from "@cal-market/db";
import { eq } from "drizzle-orm";

export interface BookListingInput {
  listingId?: string;
  slug?: string;
}

export interface BookListingResult {
  title: string;
  calLink: string;
  message: string;
}

export async function bookListing(
  input: BookListingInput
): Promise<BookListingResult> {
  if (!input.listingId && !input.slug) {
    throw new Error("Either listingId or slug is required to book a listing.");
  }

  const [listing] = await db
    .select()
    .from(listings)
    .where(
      input.listingId
        ? eq(listings.id, input.listingId)
        : eq(listings.slug, input.slug ?? "")
    )
    .limit(1);

  if (!listing) {
    throw new Error("Listing not found.");
  }

  return {
    calLink: listing.calLink,
    message: `Book ${listing.title} on Cal.com: ${listing.calLink}`,
    title: listing.title,
  };
}
