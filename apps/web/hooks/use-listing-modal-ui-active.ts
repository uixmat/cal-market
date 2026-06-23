"use client";

import { usePathname } from "next/navigation";
import type * as React from "react";

import { isListingDetailPath } from "@/lib/listing-layout";

export function useListingModalUiActive(): boolean {
  const pathname = usePathname();
  return isListingDetailPath(pathname);
}
