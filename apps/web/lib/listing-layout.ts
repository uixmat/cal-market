export function listingLayoutId(slug: string): string {
  return `listing-${slug}`;
}

export function listingImageLayoutId(slug: string): string {
  return `listing-${slug}-image`;
}

/** motion.dev modal-shared-layout z-stack base */
export const LISTING_LAYOUT_BASE_Z_INDEX = 2000;

export const listingLayoutZIndex = {
  image: LISTING_LAYOUT_BASE_Z_INDEX + 2,
  overlay: LISTING_LAYOUT_BASE_Z_INDEX,
  thumbnail: LISTING_LAYOUT_BASE_Z_INDEX + 1,
} as const;

export function isListingDetailPath(pathname: string): boolean {
  return /^\/listings\/[^/]+$/.test(pathname);
}

export function isListingModalNavigation(
  previousPathname: string,
  pathname: string
): boolean {
  const wasListing = isListingDetailPath(previousPathname);
  const isListing = isListingDetailPath(pathname);
  return wasListing !== isListing;
}

/** @deprecated Use listingLayoutZIndex.image */
export const LISTING_MODAL_Z_INDEX = listingLayoutZIndex.image;
