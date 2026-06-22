import Link from "next/link";
import type * as React from "react";

import { topRatedProfessionals } from "@/components/top-rated-professionals/professionals";
import type { TopRatedProfessional } from "@/components/top-rated-professionals/professionals";
import { TopRatedProfessionalCard } from "@/components/top-rated-professionals/top-rated-professional-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TopRatedProfessionalsGrid({
  professionals = topRatedProfessionals,
}: {
  professionals?: TopRatedProfessional[];
}): React.ReactElement {
  return (
    <div className="group/grid flex flex-col gap-6">
      <div className="relative">
        <div className="top-rated-professionals-grid grid gap-4 sm:grid-cols-2">
          {professionals.map((professional) => (
            <TopRatedProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-sidebar to-transparent transition-opacity duration-300 ease-out sm:h-40",
            "max-sm:group-has-[.top-rated-professionals-grid>*:nth-child(n+2):hover]/grid:opacity-0",
            "sm:group-has-[.top-rated-professionals-grid>*:nth-child(n+3):hover]/grid:opacity-0"
          )}
        />
      </div>

      <div className="flex justify-center">
        <Button render={<Link href="/search" />} size="sm" variant="outline">
          View all
        </Button>
      </div>
    </div>
  );
}
