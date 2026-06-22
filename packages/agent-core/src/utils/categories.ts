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

export function extractCityFromQuery(query: string): string | undefined {
  const match = query.match(/\b(?:in|near|around)\s+([a-z\s]+?)(?:\?|$|,)/i);
  return match?.[1]?.trim();
}
