import type * as React from "react";

import { homeCategories } from "@/components/home-categories/categories";
import { CategoryCard } from "@/components/home-categories/category-card";

export function HomeCategories(): React.ReactElement {
  return (
    <section aria-labelledby="home-categories-title">
      <div className="mb-8 flex flex-col items-center gap-2 text-center sm:mb-10">
        <h2
          className="font-heading font-semibold text-foreground text-xl tracking-tight sm:text-2xl"
          id="home-categories-title"
        >
          Browse by category
        </h2>
        <p className="max-w-2xl text-pretty text-muted-foreground text-sm sm:text-base">
          Medical, pets, sports, dance, and social — find local services you can
          book instantly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {homeCategories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}
