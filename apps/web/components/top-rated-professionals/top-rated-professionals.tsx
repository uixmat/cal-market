import type * as React from "react";

import { SectionHeader } from "@/components/layout/section-header";
import { TopRatedProfessionalsGrid } from "@/components/top-rated-professionals/top-rated-professionals-grid";

export function TopRatedProfessionals(): React.ReactElement {
  return (
    <section aria-label="Top rated professionals">
      <div className="flex flex-col gap-10">
        <SectionHeader
          align="center"
          badge="Top rated"
          description="Highest rated providers ready to help you."
          title="Top rated professionals"
        />
        <TopRatedProfessionalsGrid />
      </div>
    </section>
  );
}
