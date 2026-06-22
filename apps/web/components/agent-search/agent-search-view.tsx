"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRouter, useSearchParams } from "next/navigation";
import type * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  AgentExchangeGhost,
  AgentPromptBar,
} from "@/components/agent-search/agent-prompt-bar";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeader } from "@/components/layout/section-header";
import { ListingsGrid } from "@/components/listings-grid";
import { ListingsPagination } from "@/components/listings-pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  AgentExchange,
  BrowseListing,
  SearchListingsToolOutput,
} from "@/lib/agent-search";
import {
  buildResultsTitle,
  extractLatestExchange,
  extractSearchListingsFromMessages,
} from "@/lib/agent-search";

const suggestions = [
  "Show me dentists nearby",
  "Book me a dentist nearby",
  "Find ski instructors in Tahoe",
  "Show me veterinarians in Oakland",
];

function getDisplayListings(
  hasAgentResults: boolean,
  agentListings: BrowseListing[],
  showBrowse: boolean,
  browseListings: BrowseListing[]
): BrowseListing[] {
  if (hasAgentResults) {
    return agentListings;
  }

  if (showBrowse) {
    return browseListings;
  }

  return [];
}

function getPageTitle(
  hasAgentResults: boolean,
  exchange: AgentExchange | null,
  searchResult: SearchListingsToolOutput | null,
  initialQuery: string | null
): string {
  if (hasAgentResults || exchange) {
    return buildResultsTitle(searchResult, exchange?.userText ?? initialQuery);
  }

  return "Services near you";
}

function SearchSuggestions({
  disabled,
  onSelect,
}: {
  disabled: boolean;
  onSelect: (text: string) => void;
}): React.ReactElement {
  return (
    <div className="flex flex-wrap justify-center gap-2 border-border/70 border-y py-5">
      {suggestions.map((suggestion) => (
        <Button
          disabled={disabled}
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          size="sm"
          type="button"
          variant="outline"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}

function SearchLoadingGrid(): React.ReactElement {
  return (
    <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="flex flex-col gap-3" key={`skeleton-${index}`}>
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

function SearchResultsSection({
  browsePage,
  browseTotalPages,
  displayCount,
  hasAgentResults,
  listings,
}: {
  browsePage: number;
  browseTotalPages: number;
  displayCount: number;
  hasAgentResults: boolean;
  listings: BrowseListing[];
}): React.ReactElement {
  return (
    <>
      <div className="flex items-center justify-between border-border border-y py-3">
        <p className="text-muted-foreground text-sm">
          <span className="tabular-nums">{displayCount}</span>{" "}
          {displayCount === 1 ? "service" : "services"}{" "}
          {hasAgentResults ? "found" : "available"}
          {hasAgentResults || browseTotalPages <= 1 ? null : (
            <>
              {" "}
              · page <span className="tabular-nums">{browsePage}</span> of{" "}
              <span className="tabular-nums">{browseTotalPages}</span>
            </>
          )}
        </p>
      </div>
      <ListingsGrid listings={listings} showFade={false} />
      {hasAgentResults ? null : (
        <ListingsPagination page={browsePage} totalPages={browseTotalPages} />
      )}
    </>
  );
}

function getPromptSection({
  activeUserQuery,
  exchange,
  isLoading,
  showBrowse,
  submitPrompt,
}: {
  activeUserQuery: string | null;
  exchange: AgentExchange | null;
  isLoading: boolean;
  showBrowse: boolean;
  submitPrompt: (text: string) => void;
}): React.ReactNode {
  if (activeUserQuery && (exchange || isLoading)) {
    return (
      <AgentExchangeGhost
        assistantText={exchange?.assistantText ?? ""}
        isLoading={isLoading}
        userText={activeUserQuery}
      />
    );
  }

  if (showBrowse) {
    return <SearchSuggestions disabled={isLoading} onSelect={submitPrompt} />;
  }

  return null;
}

export function AgentSearchView({
  browseListings,
  browsePage,
  browseTotal,
  browseTotalPages,
}: {
  browseListings: BrowseListing[];
  browsePage: number;
  browseTotal: number;
  browseTotalPages: number;
}): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const hasAutoSubmitted = useRef(false);

  const [input, setInput] = useState(initialQuery ?? "");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const exchange = extractLatestExchange(messages);
  const searchResult = extractSearchListingsFromMessages(messages);
  const agentListings = searchResult?.listings ?? [];
  const hasAgentResults = agentListings.length > 0;
  const isAgentMode = Boolean(initialQuery) || messages.length > 0;
  const showBrowse = !isAgentMode || (!isLoading && !exchange);
  const displayListings = getDisplayListings(
    hasAgentResults,
    agentListings,
    showBrowse,
    browseListings
  );
  const displayCount = hasAgentResults ? agentListings.length : browseTotal;
  const title = getPageTitle(
    hasAgentResults,
    exchange,
    searchResult,
    initialQuery
  );

  const submitPrompt = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) {
        return;
      }

      router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
        scroll: false,
      });
      void sendMessage({ text: trimmed });
      setInput("");
    },
    [isLoading, router, sendMessage]
  );

  useEffect(() => {
    if (!initialQuery || hasAutoSubmitted.current) {
      return;
    }

    hasAutoSubmitted.current = true;
    void sendMessage({ text: initialQuery });
  }, [initialQuery, sendMessage]);

  const activeUserQuery = exchange?.userText ?? initialQuery;

  const promptSection = getPromptSection({
    activeUserQuery,
    exchange,
    isLoading,
    showBrowse,
    submitPrompt,
  });

  return (
    <SectionContainer className="flex min-h-0 flex-1 flex-col py-8 sm:px-12 sm:py-10">
      <div className="flex min-h-0 flex-1 flex-col gap-8 sm:gap-10">
        <SectionHeader
          align="center"
          badge="AI Search"
          description="Browse bookable local services — dentists, vets, instructors, and more."
          title={title}
        />

        <AgentPromptBar
          disabled={isLoading}
          onChange={setInput}
          onSubmit={() => submitPrompt(input)}
          value={input}
        />

        {promptSection}

        {isLoading && isAgentMode && !hasAgentResults ? (
          <SearchLoadingGrid />
        ) : null}

        {displayListings.length > 0 ? (
          <SearchResultsSection
            browsePage={browsePage}
            browseTotalPages={browseTotalPages}
            displayCount={displayCount}
            hasAgentResults={hasAgentResults}
            listings={displayListings}
          />
        ) : null}

        {!isLoading && exchange && !hasAgentResults ? (
          <p className="text-center text-muted-foreground text-sm">
            No listings matched that search. Try a different category or city.
          </p>
        ) : null}
      </div>
    </SectionContainer>
  );
}
