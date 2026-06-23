import type { ListingDetailData } from "@/components/listing-detail/listing-detail-content";

const listingsBySlug = new Map<string, ListingDetailData>();
let closingSlug: string | null = null;
const closingListeners = new Set<() => void>();

function emitClosingChange(): void {
  for (const listener of closingListeners) {
    listener();
  }
}

export function registerListingForModal(listing: ListingDetailData): void {
  listingsBySlug.set(listing.slug, listing);
}

export function peekListingForModal(slug: string): ListingDetailData | null {
  return listingsBySlug.get(slug) ?? null;
}

export function markListingModalClosing(slug: string): void {
  closingSlug = slug;
  emitClosingChange();
}

export function clearListingModalClosing(slug: string): void {
  if (closingSlug === slug) {
    closingSlug = null;
    emitClosingChange();
  }
}

export function subscribeListingModalClosing(
  onStoreChange: () => void
): () => void {
  closingListeners.add(onStoreChange);
  return () => {
    closingListeners.delete(onStoreChange);
  };
}

export function getListingModalClosingSnapshot(): string | null {
  return closingSlug;
}

export function isListingModalClosing(slug: string): boolean {
  return closingSlug === slug;
}
