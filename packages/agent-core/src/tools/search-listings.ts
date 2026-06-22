import { db, listings } from "@cal-market/db";
import type { Listing } from "@cal-market/db";
import { and, eq, ilike, or, sql } from "drizzle-orm";

import {
  CATEGORY_ALIASES,
  extractCityFromQuery,
  normalizeCategory,
} from "../utils/categories";

export interface SearchListingsInput {
  query: string;
  category?: string;
  city?: string;
  limit?: number;
}

export interface SearchListingsResult {
  listings: Listing[];
  interpretedCategory?: string;
  interpretedCity?: string;
}

export async function searchListings(
  input: SearchListingsInput
): Promise<SearchListingsResult> {
  const limit = input.limit ?? 6;
  const interpretedCategory =
    input.category ?? normalizeCategory(input.query) ?? undefined;
  const interpretedCity =
    input.city ?? extractCityFromQuery(input.query) ?? "San Francisco";

  const conditions = [];

  if (interpretedCategory) {
    conditions.push(eq(listings.category, interpretedCategory));
  }

  if (interpretedCity) {
    conditions.push(
      or(
        ilike(listings.city, `%${interpretedCity}%`),
        ilike(listings.region, `%${interpretedCity}%`)
      )
    );
  }

  const searchTerms = input.query
    .replaceAll(/\b(show me|find|book me|nearby|near me|a|an|the)\b/gi, "")
    .trim();

  const categoryAliases = interpretedCategory
    ? [interpretedCategory, ...(CATEGORY_ALIASES[interpretedCategory] ?? [])]
    : [];

  const hasNonCategoryTerms =
    searchTerms.length > 2 &&
    !categoryAliases.some((alias) =>
      searchTerms.toLowerCase().includes(alias.toLowerCase())
    );

  if (hasNonCategoryTerms) {
    conditions.push(
      or(
        ilike(listings.title, `%${searchTerms}%`),
        ilike(listings.description, `%${searchTerms}%`),
        ilike(listings.category, `%${searchTerms}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : sql`true`;

  const results = await db
    .select()
    .from(listings)
    .where(whereClause)
    .limit(limit);

  return {
    interpretedCategory,
    interpretedCity,
    listings: results,
  };
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.slug, slug))
    .limit(1);

  return listing ?? null;
}

export const LISTINGS_PAGE_SIZE = 12;

export async function getFeaturedListings(
  limit = LISTINGS_PAGE_SIZE
): Promise<Listing[]> {
  return db.select().from(listings).limit(limit);
}

export interface ListingsPageResult {
  listings: Listing[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function getListingsPage(
  page = 1,
  pageSize = LISTINGS_PAGE_SIZE
): Promise<ListingsPageResult> {
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;

  const [results, countResult] = await Promise.all([
    db.select().from(listings).limit(pageSize).offset(offset),
    db.select({ count: sql<number>`cast(count(*) as int)` }).from(listings),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    listings: results,
    page: Math.min(safePage, totalPages),
    pageSize,
    total,
    totalPages,
  };
}
