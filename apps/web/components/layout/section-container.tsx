import type * as React from "react";

import { cn } from "@/lib/utils";

export function SectionContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card",
        "shadow-[0_1px_5px_-4px_rgba(36,36,36,0.18),0_4px_8px_0_rgba(36,36,36,0.04)]",
        "px-6 py-12 sm:px-16 sm:py-20",
        "dark:shadow-[0_1px_5px_-4px_rgba(0,0,0,0.5),0_4px_8px_0_rgba(0,0,0,0.2)]",
        className
      )}
      data-slot="section-container"
    >
      {children}
    </section>
  );
}
