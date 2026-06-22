export type CategoryBadgeVariant =
  | "dance"
  | "dentist"
  | "doctor"
  | "fitness"
  | "mountain-biking"
  | "ski-snowboard"
  | "social-club"
  | "sports"
  | "veterinarian";

const CATEGORY_BADGE_VARIANTS: Record<string, CategoryBadgeVariant> = {
  dance: "dance",
  dentist: "dentist",
  doctor: "doctor",
  fitness: "fitness",
  "mountain-biking": "mountain-biking",
  "ski-snowboard": "ski-snowboard",
  "social-club": "social-club",
  sports: "sports",
  veterinarian: "veterinarian",
};

export function formatCategoryLabel(category: string): string {
  return category
    .replaceAll("-", " ")
    .replaceAll(/\b\w/g, (character) => character.toUpperCase());
}

export function getCategoryBadgeVariant(
  category: string
): CategoryBadgeVariant | "secondary" {
  return CATEGORY_BADGE_VARIANTS[category] ?? "secondary";
}
