import { openai } from "@ai-sdk/openai";
import {
  bookListing,
  bookListingSchema,
  DISCOVER_SYSTEM_PROMPT,
  searchListings,
  searchListingsSchema,
} from "@cal-market/agent-core";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import type { UIMessage } from "ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    messages: await convertToModelMessages(messages),
    model: openai("gpt-4o-mini"),
    stopWhen: stepCountIs(5),
    system: DISCOVER_SYSTEM_PROMPT,
    tools: {
      book_listing: tool({
        description: "Get the Cal.com booking link for a listing",
        execute: async (input) => bookListing(input),
        inputSchema: bookListingSchema,
      }),
      search_listings: tool({
        description: "Search Discover marketplace listings",
        execute: async (input) => {
          const searchResult = await searchListings(input);
          return {
            interpretedCategory: searchResult.interpretedCategory,
            interpretedCity: searchResult.interpretedCity,
            listings: searchResult.listings.map((listing) => ({
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
        inputSchema: searchListingsSchema,
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
