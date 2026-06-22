import type * as React from "react";

import {
  pageSectionsBgClass,
  siteRailInsetClass,
} from "@/components/layout/site-rail";
import { cn } from "@/lib/utils";

export function PageSections({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={cn(
        siteRailInsetClass,
        "flex flex-col py-8 sm:py-10",
        className
      )}
      data-slot="page-sections"
    >
      {children}
    </div>
  );
}

export { pageSectionsBgClass };
