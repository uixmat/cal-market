import {
  extractCityFromQuery,
  mergeQueryWithUserLocation,
} from "./utils/categories";

export interface PriorSearchContext {
  interpretedCategory?: string;
  interpretedCity?: string;
}

const SEARCH_REFINEMENT_PATTERN =
  /^(?:what about|how about|and(?: what about)?|also|instead(?: of)?)\b/i;

const NEARBY_LOCATION_PATTERN = /\b(nearby|near me|around here|close to me)\b/i;

export function isSearchRefinementQuery(query: string): boolean {
  return SEARCH_REFINEMENT_PATTERN.test(query.trim());
}

export function applySearchContext(
  input: { query: string; category?: string; city?: string; limit?: number },
  prior: PriorSearchContext | null | undefined,
  userMessage?: string
): { query: string; category?: string; city?: string; limit?: number } {
  const refinementSource = userMessage ?? input.query;

  if (!prior?.interpretedCity || !isSearchRefinementQuery(refinementSource)) {
    return input;
  }

  if (extractCityFromQuery(input.query)) {
    return input;
  }

  if (NEARBY_LOCATION_PATTERN.test(refinementSource)) {
    return input;
  }

  return {
    ...input,
    query: `${input.query.trim()} in ${prior.interpretedCity}`,
  };
}

export function buildSearchListingsQuery(
  userMessage: string,
  toolQuery: string,
  prior: PriorSearchContext | null | undefined
): string {
  const mergedQuery = mergeQueryWithUserLocation(userMessage, toolQuery);
  return applySearchContext({ query: mergedQuery }, prior, userMessage).query;
}

export function buildDiscoverSystemPrompt(
  basePrompt: string,
  query: string,
  prior: PriorSearchContext | null | undefined
): string {
  if (!isSearchRefinementQuery(query) || !prior?.interpretedCity) {
    return basePrompt;
  }

  return `${basePrompt}

The user is refining their prior search in ${prior.interpretedCity}. Keep the same location unless they specify a new city or say "near me".`;
}
