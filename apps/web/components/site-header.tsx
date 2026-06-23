"use client";

import Link from "next/link";
import type * as React from "react";
import { useEffect, useState } from "react";

import { siteRailInsetClass } from "@/components/layout/site-rail";
import { LocationCountrySelector } from "@/components/location-country-selector";
import { SiteMobileMenu } from "@/components/site-mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const scrollThresholdPx = 12;

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
    <header className="isolate top-0 z-[100] max-sm:fixed max-sm:inset-x-0 max-sm:pt-[env(safe-area-inset-top,0px)] sm:sticky sm:z-50 max-sm:[view-transition-name:none] sm:[view-transition-name:site-header]">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(100%+2rem)] bg-gradient-to-b from-sidebar to-transparent transition-opacity duration-200 ease-out",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          siteRailInsetClass,
          "relative z-10 pt-4 pb-3 max-sm:touch-manipulation"
        )}
      >
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

            <LocationCountrySelector className="hidden sm:flex" />
          </div>

          <div className="pointer-events-auto ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              className="hidden sm:inline-flex"
              render={<Link href="/search" />}
              size="sm"
            >
              Discover
            </Button>
            <ThemeToggle className="hidden sm:inline-flex" />
            <SiteMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
