import type * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeader({
  badge,
  title,
  description,
  actions,
  align = "start",
  className,
}: {
  badge?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
}): React.ReactElement {
  const isCentered = align === "center";

  if (isCentered) {
    return (
      <div
        className={cn(
          "mx-auto flex max-w-2xl flex-col items-center gap-6 text-center",
          className
        )}
        data-slot="section-header"
      >
        {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        <div>
          <h2 className="text-balance font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      data-slot="section-header"
    >
      <div className="max-w-2xl">
        {badge ? (
          <Badge className="mb-4" variant="secondary">
            {badge}
          </Badge>
        ) : null}
        <h2 className="text-balance font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
