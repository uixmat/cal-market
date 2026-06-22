"use client";

import Link from "next/link";
import type * as React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getVisiblePaginationPages } from "@/lib/agent-search";
import { cn } from "@/lib/utils";

function buildBrowseHref(page: number): string {
  if (page <= 1) {
    return "/search";
  }

  return `/search?page=${page}`;
}

export function ListingsPagination({
  className,
  page,
  totalPages,
}: {
  className?: string;
  page: number;
  totalPages: number;
}): React.ReactElement | null {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePaginationPages(page, totalPages);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious
              render={<Link href={buildBrowseHref(page - 1)} />}
            />
          ) : (
            <PaginationPrevious
              className="pointer-events-none opacity-50"
              tabIndex={-1}
            />
          )}
        </PaginationItem>

        {visiblePages.map((visiblePage, index) => {
          if (visiblePage === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={visiblePage}>
              <PaginationLink
                isActive={visiblePage === page}
                render={<Link href={buildBrowseHref(visiblePage)} />}
              >
                {visiblePage}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          {page < totalPages ? (
            <PaginationNext
              render={<Link href={buildBrowseHref(page + 1)} />}
            />
          ) : (
            <PaginationNext
              className={cn("pointer-events-none opacity-50")}
              tabIndex={-1}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
