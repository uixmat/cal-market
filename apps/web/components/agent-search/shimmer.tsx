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
    <span className={cn("animate-pulse text-muted-foreground", className)}>
      {children}
    </span>
  );
}
