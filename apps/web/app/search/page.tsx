import { getListingsPage, LISTINGS_PAGE_SIZE } from "@cal-market/agent-core";
import { Suspense } from "react";

import { AgentSearchView } from "@/components/agent-search/agent-search-view";
import { PageSections } from "@/components/layout/page-sections";
import { SectionContainer } from "@/components/layout/section-container";
import { Skeleton } from "@/components/ui/skeleton";
import { toBrowseListing } from "@/lib/agent-search";

export const dynamic = "force-dynamic";

function SearchFallback() {
  return (
    <SectionContainer className="flex min-h-0 flex-1 flex-col py-8 sm:px-12 sm:py-10">
      <div className="flex flex-col gap-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: LISTINGS_PAGE_SIZE }).map((_, index) => (
            <Skeleton
              className="aspect-[4/3] w-full rounded-none"
              key={`search-fallback-${index}`}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

async function SearchPageContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const browseData = await getListingsPage(page);

  return (
    <AgentSearchView
      browseListings={browseData.listings.map(toBrowseListing)}
      browsePage={browseData.page}
      browseTotal={browseData.total}
      browseTotalPages={browseData.totalPages}
    />
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <PageSections className="flex min-h-0 flex-1 flex-col py-4 sm:py-6">
      <div className="flex min-h-0 flex-1 flex-col">
        <Suspense fallback={<SearchFallback />}>
          <SearchPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </PageSections>
  );
}
