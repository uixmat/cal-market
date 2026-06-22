"use client";

import { MapPinIcon } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { useEffect, useState } from "react";

import { siteRailInsetClass } from "@/components/layout/site-rail";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const scrollThresholdPx = 12;
const userLocation = "San Francisco";

export function SiteHeader(): React.ReactElement {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > scrollThresholdPx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className={cn(siteRailInsetClass, "pt-4 pb-3")}>
        <div
          className={cn(
            "mx-auto flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-[max-width,background-color,border-color,box-shadow,backdrop-filter,border-radius] duration-200 ease-out sm:gap-4 sm:px-4 sm:py-2.5",
            scrolled ? "max-w-6xl" : "max-w-full rounded-none",
            scrolled
              ? "border-border bg-card/95 shadow-[0_1px_5px_-4px_rgba(36,36,36,0.12),0_4px_8px_0_rgba(36,36,36,0.04)] backdrop-blur-sm dark:shadow-[0_1px_5px_-4px_rgba(0,0,0,0.45),0_4px_8px_0_rgba(0,0,0,0.2)]"
              : "border-transparent bg-transparent shadow-none backdrop-blur-none"
          )}
        >
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link
              className="shrink-0 font-heading font-semibold text-base tracking-tight sm:text-lg"
              href="/"
            >
              Discover
            </Link>

            <p
              aria-label={`Current location: ${userLocation}`}
              className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-sm"
            >
              <MapPinIcon aria-hidden className="size-3.5 shrink-0" />
              <span className="truncate">{userLocation}</span>
            </p>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 sm:flex">
            <Button render={<Link href="/" />} size="sm" variant="ghost">
              Browse
            </Button>
          </nav>

          <div className="flex shrink-0 items-center gap-0.5">
            <Button render={<Link href="/search" />} size="sm">
              AI Search
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
