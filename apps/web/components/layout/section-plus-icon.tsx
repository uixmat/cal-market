import type * as React from "react";

import { cn } from "@/lib/utils";

export function SectionPlusIcon({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-6 shrink-0 text-foreground/15", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
