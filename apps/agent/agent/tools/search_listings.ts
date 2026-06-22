import { searchListings } from "@cal-market/agent-core";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Search Discover marketplace listings",
  async execute(input) {
    const result = await searchListings(input);
    return {
      interpretedCategory: result.interpretedCategory,
      interpretedCity: result.interpretedCity,
      listings: result.listings.map((listing) => ({
        calLink: listing.calLink,
        category: listing.category,
        city: listing.city,
        description: listing.description,
        id: listing.id,
        slug: listing.slug,
        title: listing.title,
      })),
    };
  },
  inputSchema: z.object({
    category: z.string().optional(),
    city: z.string().optional(),
    limit: z.number().int().min(1).max(20).optional(),
    query: z.string().min(1),
  }),
});
