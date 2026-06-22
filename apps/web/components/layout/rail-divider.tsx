import type * as React from "react";

import { SectionPlusIcon } from "@/components/layout/section-plus-icon";
import {
  pageSectionsBgClass,
  siteRailInsetBleedClass,
} from "@/components/layout/site-rail";
import { cn } from "@/lib/utils";

export function RailDivider({
  bleed = false,
  className,
  heightClass = "h-16 sm:h-20",
}: {
  bleed?: boolean;
  className?: string;
  heightClass?: string;
}): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative",
        heightClass,
        bleed && siteRailInsetBleedClass,
        className
      )}
      data-slot="rail-divider"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-px w-screen -translate-x-1/2 -translate-y-1/2 bg-border" />
      <div className="pointer-events-none absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn(
            "flex size-6 items-center justify-center",
            pageSectionsBgClass
          )}
        >
          <SectionPlusIcon />
        </div>
      </div>
      <div className="pointer-events-none absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2">
        <div
          className={cn(
            "flex size-6 items-center justify-center",
            pageSectionsBgClass
          )}
        >
          <SectionPlusIcon />
        </div>
      </div>
    </div>
  );
}

export function SectionDivider({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return <RailDivider bleed className={className} />;
}
