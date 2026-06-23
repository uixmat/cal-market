import type { ListingDetailData } from "@/components/listing-detail/listing-detail-content";

const listingsBySlug = new Map<string, ListingDetailData>();
let activeListingSlug: string | null = null;
let closingSlug: string | null = null;
const activeListeners = new Set<() => void>();
const closingListeners = new Set<() => void>();

function emitActiveChange(): void {
  for (const listener of activeListeners) {
    listener();
  }
}

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

export function markActiveListingSlug(slug: string): void {
  activeListingSlug = slug;
  emitActiveChange();
}

export function clearActiveListingSlug(slug: string): void {
  if (activeListingSlug === slug) {
    activeListingSlug = null;
    emitActiveChange();
  }
}

export function subscribeActiveListingSlug(
  onStoreChange: () => void
): () => void {
  activeListeners.add(onStoreChange);
  return () => {
    activeListeners.delete(onStoreChange);
  };
}

export function getActiveListingSlugSnapshot(): string | null {
  return activeListingSlug;
}

export function isActiveListingSlug(slug: string): boolean {
  return activeListingSlug === slug;
}

export function markListingModalClosing(slug: string): void {
  closingSlug = slug;
  activeListingSlug = slug;
  emitClosingChange();
  emitActiveChange();
}

export function clearListingModalClosing(slug: string): void {
  if (closingSlug === slug) {
    closingSlug = null;
    emitClosingChange();
  }

  if (activeListingSlug === slug) {
    activeListingSlug = null;
    emitActiveChange();
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
