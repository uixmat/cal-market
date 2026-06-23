"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { useState } from "react";

import { homeCategories } from "@/components/home-categories/categories";
import { LocationCountrySelector } from "@/components/location-country-selector";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const navLinkClass =
  "flex min-h-11 items-center rounded-md px-3 font-medium text-base text-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

export function SiteMobileMenu({
  className,
}: {
  className?: string;
}): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-controls="site-mobile-menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Open menu"
        className={cn(
          "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-foreground outline-none touch-manipulation hover:bg-accent sm:hidden",
          className
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        <MenuIcon aria-hidden className="size-5" />
      </button>

      <Drawer onOpenChange={setOpen} open={open} position="right">
        <DrawerPopup id="site-mobile-menu" showCloseButton showBar>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>

          <DrawerPanel className="flex flex-col gap-6 pt-2">
            <div className="px-3">
              <LocationCountrySelector className="w-full" />
            </div>

            <nav aria-label="Main" className="flex flex-col gap-1 px-3">
              <Link
                className={navLinkClass}
                href="/search"
                onClick={() => setOpen(false)}
              >
                Search with AI
              </Link>
            </nav>

            <div className="px-3">
              <p className="mb-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Categories
              </p>
              <nav aria-label="Categories" className="flex flex-col gap-1">
                {homeCategories.map((category) => (
                  <Link
                    className={navLinkClass}
                    href={category.href}
                    key={category.title}
                    onClick={() => setOpen(false)}
                  >
                    {category.title}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center justify-between border-t px-6 pt-4">
              <span className="text-muted-foreground text-sm">Theme</span>
              <ThemeToggle />
            </div>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    </>
  );
}
