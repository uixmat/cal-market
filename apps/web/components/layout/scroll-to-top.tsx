"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

import { isListingModalNavigation } from "@/lib/listing-layout";

export function ScrollToTop(): null {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useLayoutEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    if (isListingModalNavigation(previousPathname, pathname)) {
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
