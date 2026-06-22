import { z } from "zod";

export const searchListingsSchema = z.object({
  category: z.string().optional().describe("Optional category filter"),
  city: z.string().optional().describe("Optional city filter"),
  limit: z.number().int().min(1).max(20).optional().describe("Max results"),
  query: z
    .string()
    .describe(
      'Natural language search, e.g. "dentists nearby" or "ski instructors in Tahoe"'
    ),
});

export const bookListingSchema = z.object({
  listingId: z.string().uuid().optional().describe("Listing UUID"),
  slug: z.string().optional().describe("Listing slug"),
});

export type SearchListingsSchema = z.infer<typeof searchListingsSchema>;
export type BookListingSchema = z.infer<typeof bookListingSchema>;
