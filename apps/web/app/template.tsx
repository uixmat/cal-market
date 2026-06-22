"use client";

import type * as React from "react";
import { ViewTransition } from "react";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <ViewTransition default="none" enter="page-fade" exit="page-fade">
      {children}
    </ViewTransition>
  );
}
