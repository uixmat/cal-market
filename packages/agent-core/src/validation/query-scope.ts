import { extractCityFromQuery, normalizeCategory } from "../utils/categories";

export const DISCOVER_OUT_OF_SCOPE_MESSAGE =
  "I'm the Discover assistant — I only help you find and book local services on Cal Discover (dentists, vets, instructors, fitness, and more). Try something like “Show me dentists nearby” or “Find ski instructors in Tahoe.”";

export interface DiscoverQueryValidation {
  ok: true;
}

export interface DiscoverQueryRejection {
  ok: false;
  message: string;
}

export type DiscoverQueryValidationResult =
  | DiscoverQueryValidation
  | DiscoverQueryRejection;

const DISCOVER_VERB_PATTERN =
  /\b(find|show me|book(?: me)?|list|search(?: for)?|looking for|need a|recommend)\b/i;

const NEARBY_PATTERN = /\b(nearby|near me|around here|close to me)\b/i;

const SERVICE_TERM_PATTERN =
  /\b(services?|listings?|instructors?|classes?|providers?|appointments?|bookable)\b/i;

const BOOKING_FOLLOW_UP_PATTERN = /\b(book|schedule|reserve)\b/i;

const OUT_OF_SCOPE_PATTERNS: RegExp[] = [
  /\b(write me|write a|create a|generate|implement|build me)\b.*\b(code|function|component|script|program|app|api)\b/i,
  /\b(react|typescript|javascript|python|usestate|useeffect|jsx|tsx|npm|node\.js)\b/i,
  /\b(explain|describe|tell me about|what is the history|how did|why did|summarize)\b/i,
  /\b(homework|essay|poem|story|thesis|dissertation)\b/i,
  /\b(capital of|population of|who (?:is|was)|when (?:did|was)|best beach|best restaurant|travel guide|weather forecast)\b/i,
  /\b(recipe for|cook me|translate (?:this|to)|solve (?:this|for)|calculate)\b/i,
  /\b(events?|concerts?|festivals?|nightlife|parties)\b/i,
];

function matchesOutOfScopePattern(query: string): boolean {
  return OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(query));
}

function hasBookingIntent(query: string): boolean {
  if (!BOOKING_FOLLOW_UP_PATTERN.test(query)) {
    return false;
  }

  if (normalizeCategory(query)) {
    return true;
  }

  return /\b[a-z0-9]+(?:-[a-z0-9]+)+\b/i.test(query);
}

function hasDiscoverSearchIntent(query: string): boolean {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length === 0) {
    return false;
  }

  if (normalizeCategory(normalizedQuery)) {
    return true;
  }

  const hasDiscoverVerb = DISCOVER_VERB_PATTERN.test(normalizedQuery);
  const hasNearbyIntent = NEARBY_PATTERN.test(normalizedQuery);
  const hasServiceTerms = SERVICE_TERM_PATTERN.test(normalizedQuery);
  const hasCity = Boolean(extractCityFromQuery(normalizedQuery));

  if (hasDiscoverVerb || hasNearbyIntent) {
    if (normalizeCategory(normalizedQuery)) {
      return true;
    }

    if (hasServiceTerms) {
      return true;
    }

    if (hasDiscoverVerb && hasCity) {
      return true;
    }
  }

  return false;
}

export function validateDiscoverQuery(
  query: string
): DiscoverQueryValidationResult {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length === 0) {
    return {
      message: DISCOVER_OUT_OF_SCOPE_MESSAGE,
      ok: false,
    };
  }

  if (matchesOutOfScopePattern(normalizedQuery)) {
    return {
      message: DISCOVER_OUT_OF_SCOPE_MESSAGE,
      ok: false,
    };
  }

  if (
    hasBookingIntent(normalizedQuery) ||
    hasDiscoverSearchIntent(normalizedQuery)
  ) {
    return { ok: true };
  }

  return {
    message: DISCOVER_OUT_OF_SCOPE_MESSAGE,
    ok: false,
  };
}
