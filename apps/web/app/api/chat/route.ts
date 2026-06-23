import { openai } from "@ai-sdk/openai";
import {
  bookListing,
  bookListingSchema,
  buildDiscoverSystemPrompt,
  buildSearchListingsQuery,
  DISCOVER_SYSTEM_PROMPT,
  searchListings,
  searchListingsSchema,
  validateDiscoverQuery,
} from "@cal-market/agent-core";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  stepCountIs,
  streamText,
  tool,
} from "ai";
import type { UIMessage } from "ai";

import { extractPriorSearchContext } from "@/lib/agent-search";

export const maxDuration = 60;

const BENIGN_FOLLOW_UP_PATTERN =
  /^(?:thanks|thank you|ok(?:ay)?|cool|great|got it|bye|goodbye)[!.?\s]*$/i;

const BENIGN_FOLLOW_UP_MESSAGE =
  "You're welcome! Ask if you'd like to find or book another service on Discover.";

function extractLatestUserText(messages: UIMessage[]): string | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "user") {
      continue;
    }

    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("")
      .trim();

    if (text.length > 0) {
      return text;
    }
  }

  return null;
}

function createStaticAssistantResponse(message: string): Response {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        const messageId = generateId();
        const textId = generateId();

        writer.write({ messageId, type: "start" });
        writer.write({ id: textId, type: "text-start" });
        writer.write({ delta: message, id: textId, type: "text-delta" });
        writer.write({ id: textId, type: "text-end" });
        writer.write({ type: "finish" });
      },
    }),
  });
}

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const latestUserText = extractLatestUserText(messages);

  if (!latestUserText) {
    return new Response("Missing user message.", { status: 400 });
  }

  if (
    messages.length > 1 &&
    BENIGN_FOLLOW_UP_PATTERN.test(latestUserText.trim())
  ) {
    return createStaticAssistantResponse(BENIGN_FOLLOW_UP_MESSAGE);
  }

  const validation = validateDiscoverQuery(latestUserText);
  if (!validation.ok) {
    return createStaticAssistantResponse(validation.message);
  }

  const priorSearch = extractPriorSearchContext(messages);

  const result = streamText({
    messages: [{ content: latestUserText, role: "user" }],
    model: openai("gpt-4o-mini"),
    stopWhen: stepCountIs(5),
    system: buildDiscoverSystemPrompt(
      DISCOVER_SYSTEM_PROMPT,
      latestUserText,
      priorSearch
    ),
    tools: {
      book_listing: tool({
        description: "Get the Cal.com booking link for a listing",
        execute: async (input) => bookListing(input),
        inputSchema: bookListingSchema,
      }),
      search_listings: tool({
        description: "Search Discover marketplace listings",
        execute: async (input) => {
          const queryValidation = validateDiscoverQuery(input.query);
          if (!queryValidation.ok) {
            throw new Error(queryValidation.message);
          }

          const resolvedQuery = buildSearchListingsQuery(
            latestUserText,
            input.query,
            priorSearch
          );
          const searchResult = await searchListings({
            category: input.category,
            limit: input.limit,
            query: resolvedQuery,
          });
          return {
            interpretedCategory: searchResult.interpretedCategory,
            interpretedCity: searchResult.interpretedCity,
            listings: searchResult.listings.map((listing) => ({
              calLink: listing.calLink,
              category: listing.category,
              city: listing.city,
              description: listing.description,
              id: listing.id,
              imageUrl: listing.imageUrl,
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
