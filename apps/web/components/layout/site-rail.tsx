import type * as React from "react";

import { cn } from "@/lib/utils";

/** Page canvas behind section cards and divider junction masks. */
export const pageSectionsBgClass = "bg-sidebar";

/** Space outside the vertical rails (viewport gutters). */
export const siteRailOuterClass =
  "mx-auto w-full max-w-[1440px] px-8 sm:px-12 lg:px-16";

/** Inset between the rails and section content. */
export const siteRailInsetClass = "px-4 sm:px-6";

/** Bleed inner content back to the rail edges (for dividers). */
export const siteRailInsetBleedClass = "-mx-4 sm:-mx-6";

export function SiteRail({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={cn("flex min-h-full flex-col", pageSectionsBgClass, className)}
    >
      <div className={siteRailOuterClass}>
        <div className="flex min-h-full flex-col border-border border-x">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SiteRailInset({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return <div className={cn(siteRailInsetClass, className)}>{children}</div>;
}
