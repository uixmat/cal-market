export function listingLayoutId(slug: string): string {
  return `listing-${slug}`;
}

export function listingImageLayoutId(slug: string): string {
  return `listing-${slug}-image`;
}

/** Above site header (z-50) and grid hover states during shared layout. */
export const LISTING_MODAL_Z_INDEX = 2000;

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
