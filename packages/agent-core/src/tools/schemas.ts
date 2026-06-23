import { z } from "zod";

export const searchListingsSchema = z.object({
  category: z
    .string()
    .optional()
    .describe("Optional category filter parsed from the query"),
  city: z
    .string()
    .optional()
    .describe(
      "Deprecated — put the location in query instead, e.g. dentists in Athens"
    ),
  limit: z.number().int().min(1).max(20).optional().describe("Max results"),
  query: z
    .string()
    .describe(
      'Full natural language search including location when provided, e.g. "dentists in Athens" or "ski instructors in Tahoe"'
    ),
});

export const bookListingSchema = z.object({
  listingId: z.string().uuid().optional().describe("Listing UUID"),
  slug: z.string().optional().describe("Listing slug"),
});

export type SearchListingsSchema = z.infer<typeof searchListingsSchema>;
export type BookListingSchema = z.infer<typeof bookListingSchema>;
