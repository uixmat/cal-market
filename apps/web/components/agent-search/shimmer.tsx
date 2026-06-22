"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

export function Shimmer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-block animate-pulse bg-gradient-to-r from-muted-foreground/40 via-muted-foreground to-muted-foreground/40 bg-[length:200%_100%] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
