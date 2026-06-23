import type { UIMessage } from "ai";
import { isToolUIPart } from "ai";

export interface BrowseListing {
  calLink: string;
  category: string;
  city: string;
  description: string;
  id: string;
  imageUrl: string;
  region: string;
  slug: string;
  title: string;
}

export interface SearchListingsToolOutput {
  interpretedCategory?: string;
  interpretedCity?: string;
  listings: BrowseListing[];
}

export interface AgentExchange {
  assistantText: string;
  userText: string;
}

function isSearchListingsOutput(
  output: unknown
): output is SearchListingsToolOutput {
  if (!output || typeof output !== "object") {
    return false;
  }

  return Array.isArray((output as SearchListingsToolOutput).listings);
}

export function extractLatestUserMessage(messages: UIMessage[]): string | null {
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

export function extractLatestAssistantText(
  messages: UIMessage[]
): string | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "assistant") {
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

export function extractLatestExchange(
  messages: UIMessage[]
): AgentExchange | null {
  const userText = extractLatestUserMessage(messages);
  const assistantText = extractLatestAssistantText(messages);

  if (!userText) {
    return null;
  }

  return {
    assistantText: assistantText ?? "",
    userText,
  };
}

export function extractSearchListingsFromMessages(
  messages: UIMessage[]
): SearchListingsToolOutput | null {
  for (
    let messageIndex = messages.length - 1;
    messageIndex >= 0;
    messageIndex -= 1
  ) {
    const message = messages[messageIndex];
    if (message.role !== "assistant") {
      continue;
    }

    for (
      let partIndex = message.parts.length - 1;
      partIndex >= 0;
      partIndex -= 1
    ) {
      const part = message.parts[partIndex];

      if (!isToolUIPart(part)) {
        continue;
      }

      if (part.type !== "tool-search_listings") {
        continue;
      }

      if (part.state !== "output-available") {
        continue;
      }

      if (!isSearchListingsOutput(part.output)) {
        continue;
      }

      return part.output;
    }
  }

  return null;
}

function findLatestUserMessageIndex(messages: UIMessage[]): number {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      return index;
    }
  }

  return -1;
}

function findLatestAssistantMessageIndexAfter(
  messages: UIMessage[],
  userMessageIndex: number
): number {
  for (let index = messages.length - 1; index > userMessageIndex; index -= 1) {
    if (messages[index]?.role === "assistant") {
      return index;
    }
  }

  return -1;
}

function extractSearchListingsFromAssistantMessage(
  message: UIMessage
): SearchListingsToolOutput | null {
  if (message.role !== "assistant") {
    return null;
  }

  for (
    let partIndex = message.parts.length - 1;
    partIndex >= 0;
    partIndex -= 1
  ) {
    const part = message.parts[partIndex];

    if (!isToolUIPart(part)) {
      continue;
    }

    if (part.type !== "tool-search_listings") {
      continue;
    }

    if (part.state !== "output-available") {
      continue;
    }

    if (!isSearchListingsOutput(part.output)) {
      continue;
    }

    return part.output;
  }

  return null;
}

export function extractPriorSearchContext(
  messages: UIMessage[]
): Pick<
  SearchListingsToolOutput,
  "interpretedCategory" | "interpretedCity"
> | null {
  const latestUserIndex = findLatestUserMessageIndex(messages);
  if (latestUserIndex <= 0) {
    return null;
  }

  for (let index = latestUserIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message || message.role !== "assistant") {
      continue;
    }

    const output = extractSearchListingsFromAssistantMessage(message);
    if (output) {
      return {
        interpretedCategory: output.interpretedCategory,
        interpretedCity: output.interpretedCity,
      };
    }
  }

  return null;
}

export function extractSearchListingsForLatestExchange(
  messages: UIMessage[]
): SearchListingsToolOutput | null {
  const latestUserIndex = findLatestUserMessageIndex(messages);
  if (latestUserIndex === -1) {
    return null;
  }

  const latestAssistantIndex = findLatestAssistantMessageIndexAfter(
    messages,
    latestUserIndex
  );
  if (latestAssistantIndex === -1) {
    return null;
  }

  const assistantMessage = messages[latestAssistantIndex];
  if (!assistantMessage) {
    return null;
  }

  return extractSearchListingsFromAssistantMessage(assistantMessage);
}

export function latestExchangeHasSearchListingsTool(
  messages: UIMessage[]
): boolean {
  const latestUserIndex = findLatestUserMessageIndex(messages);
  if (latestUserIndex === -1) {
    return false;
  }

  const latestAssistantIndex = findLatestAssistantMessageIndexAfter(
    messages,
    latestUserIndex
  );
  if (latestAssistantIndex === -1) {
    return false;
  }

  const assistantMessage = messages[latestAssistantIndex];
  if (!assistantMessage || assistantMessage.role !== "assistant") {
    return false;
  }

  return assistantMessage.parts.some(
    (part) => isToolUIPart(part) && part.type === "tool-search_listings"
  );
}

export function formatCategoryLabel(category: string): string {
  return category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toBrowseListing(listing: {
  calLink: string;
  category: string;
  city: string;
  description: string;
  id: string;
  imageUrl: string;
  region?: string;
  slug: string;
  title: string;
}): BrowseListing {
  return {
    calLink: listing.calLink,
    category: listing.category,
    city: listing.city,
    description: listing.description,
    id: listing.id,
    imageUrl: listing.imageUrl,
    region: listing.region ?? "CA",
    slug: listing.slug,
    title: listing.title,
  };
}

export function getVisiblePaginationPages(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }

  if (currentPage < totalPages) {
    pages.add(currentPage + 1);
  }

  const sortedPages = [...pages].toSorted((left, right) => left - right);
  const visiblePages: (number | "ellipsis")[] = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];
    const previousPage = sortedPages[index - 1];

    if (previousPage !== undefined && page - previousPage > 1) {
      visiblePages.push("ellipsis");
    }

    visiblePages.push(page);
  }

  return visiblePages;
}

export function buildResultsTitle(
  searchResult: SearchListingsToolOutput | null,
  fallbackQuery: string | null
): string {
  if (searchResult?.interpretedCategory) {
    const category = formatCategoryLabel(searchResult.interpretedCategory);
    const city = searchResult.interpretedCity ?? "San Francisco";
    return `${category} near ${city}`;
  }

  if (fallbackQuery) {
    return fallbackQuery;
  }

  return "Services near you";
}

export function buildResultsTitleForExchange(
  searchResult: SearchListingsToolOutput | null,
  fallbackQuery: string | null
): string {
  if (searchResult) {
    return buildResultsTitle(searchResult, fallbackQuery);
  }

  if (fallbackQuery) {
    return fallbackQuery;
  }

  return "Services near you";
}
