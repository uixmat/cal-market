export const CATEGORY_ALIASES: Record<string, string[]> = {
  dance: ["dance", "dancing", "salsa", "ballet"],
  dentist: ["dentist", "dental", "orthodontist", "teeth"],
  doctor: ["doctor", "physician", "medical", "gp", "primary care"],
  fitness: ["fitness", "yoga", "workout", "gym"],
  "mountain-biking": ["mountain biking", "mtb", "bike", "cycling"],
  "ski-snowboard": ["ski", "snowboard", "skiing", "snow"],
  "social-club": ["social club", "club", "book club", "community", "workshop"],
  sports: ["sports", "tennis", "crossfit", "climbing", "swim", "fitness"],
  veterinarian: ["vet", "veterinarian", "veterinary", "pet", "animal"],
};

export function normalizeCategory(input: string): string | undefined {
  const normalized = input.toLowerCase().trim();

  for (const [category, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return category;
    }
  }

  return undefined;
}

const NEARBY_LOCATION_PATTERN = /\b(nearby|near me|around here|close to me)\b/i;

export function extractCityFromQuery(query: string): string | undefined {
  if (NEARBY_LOCATION_PATTERN.test(query)) {
    return undefined;
  }

  const locationMatch = query.match(
    /\b(?:in|near|around)\s+([a-z][a-z\s-]*(?:,\s*[a-z][a-z\s-]*)?)/i
  );
  if (!locationMatch?.[1]) {
    return undefined;
  }

  const city = locationMatch[1]
    .replaceAll(/\s+/g, " ")
    .replace(/,\s*$/, "")
    .trim();

  if (city.toLowerCase() === "me") {
    return undefined;
  }

  return city;
}

export function mergeQueryWithUserLocation(
  userMessage: string,
  toolQuery: string
): string {
  const userCity = extractCityFromQuery(userMessage);
  if (!userCity) {
    return toolQuery;
  }

  if (extractCityFromQuery(toolQuery)) {
    return toolQuery;
  }

  if (toolQuery.toLowerCase().includes(userCity.toLowerCase())) {
    return toolQuery;
  }

  return `${toolQuery.trim()} in ${userCity}`;
}

export function resolveInterpretedCity(query: string): string {
  const cityFromQuery = extractCityFromQuery(query);
  if (cityFromQuery) {
    return cityFromQuery;
  }

  if (NEARBY_LOCATION_PATTERN.test(query)) {
    return "San Francisco";
  }

  return "San Francisco";
}
