import {
  bookListing,
  bookListingSchema,
  searchListings,
  searchListingsSchema,
  validateDiscoverQuery,
} from "@cal-market/agent-core";
import { createMcpHandler } from "mcp-handler";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "search_listings",
      {
        description: "Search Discover marketplace listings",
        inputSchema: searchListingsSchema,
      },
      async (input) => {
        const validation = validateDiscoverQuery(input.query);
        if (!validation.ok) {
          return {
            content: [{ text: validation.message, type: "text" as const }],
            isError: true,
          };
        }

        const result = await searchListings(input);
        return {
          content: [
            {
              text: JSON.stringify(
                {
                  interpretedCategory: result.interpretedCategory,
                  interpretedCity: result.interpretedCity,
                  listings: result.listings,
                },
                null,
                2
              ),
              type: "text" as const,
            },
          ],
        };
      }
    );

    server.registerTool(
      "book_listing",
      {
        description: "Get the Cal.com booking link for a listing",
        inputSchema: bookListingSchema,
      },
      async (input) => {
        const result = await bookListing(input);
        return {
          content: [
            {
              text: JSON.stringify(result, null, 2),
              type: "text" as const,
            },
          ],
        };
      }
    );
  },
  {},
  {
    basePath: "/api",
    verboseLogs: process.env.NODE_ENV === "development",
  }
);

export { handler as GET, handler as POST, handler as DELETE };
