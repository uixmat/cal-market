import type * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ListingCardSkeleton({
  className,
}: {
  className?: string;
}): React.ReactElement {
  return (
    <div aria-hidden className={cn("block", className)}>
      <Card className="listing-card gap-0 overflow-visible rounded-none border-0 p-0 shadow-none [&::before]:hidden">
        <div className="listing-card-image relative aspect-[4/3] overflow-hidden">
          <Skeleton className="absolute inset-0 size-full rounded-none" />
        </div>

        <div className="listing-card-body">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-[1.125rem] w-3/4" />
            </CardTitle>
            <CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-sm sm:h-4" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardDescription>
          </CardHeader>
          <CardPanel className="pt-0">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardPanel>
        </div>
      </Card>
    </div>
  );
}
