"use client";

import { usePathname } from "next/navigation";
import type * as React from "react";
import { ViewTransition } from "react";

import { isListingDetailPath } from "@/lib/listing-layout";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const pathname = usePathname();
  // Intercept modal updates the URL to /listings/[slug] while browse content stays
  // mounted. Page-fade view transitions fight Motion shared-layout animations.
  const pageTransition = isListingDetailPath(pathname) ? "none" : "page-fade";

  return (
    <ViewTransition default="none" enter={pageTransition} exit={pageTransition}>
      {children}
    </ViewTransition>
  );
}
