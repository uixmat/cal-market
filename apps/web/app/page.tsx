import { getFeaturedListings } from "@cal-market/agent-core";
import Link from "next/link";

import { FeaturedListingsGrid } from "@/components/featured-listings-grid";
import { HomeCategories } from "@/components/home-categories/home-categories";
import { HomeListCta } from "@/components/home-cta/home-cta";
import { HomeEvents } from "@/components/home-events/home-events";
import { HomeFaq } from "@/components/home-faq/home-faq";
import { HomeHero } from "@/components/home-hero/home-hero";
import { PageSections } from "@/components/layout/page-sections";
import { SectionDivider } from "@/components/layout/rail-divider";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeader } from "@/components/layout/section-header";
import { TopRatedProfessionals } from "@/components/top-rated-professionals/top-rated-professionals";
import { Button } from "@/components/ui/button";
import { toBrowseListing } from "@/lib/agent-search";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await getFeaturedListings(6);

  return (
    <PageSections>
      <HomeHero />

      <SectionDivider />

      <HomeCategories />

      <SectionDivider />

      <SectionContainer>
        <div className="flex flex-col gap-10">
          <SectionHeader
            align="center"
            badge="Featured"
            description="Browse bookable local services in San Francisco — dentists, vets, instructors, and more."
            title="Services near you"
          />
          <div className="flex items-center justify-between border-border border-y py-3">
            <p className="text-muted-foreground text-sm">
              {listings.length} services available
            </p>
            <Button render={<Link href="/search" />} size="sm" variant="ghost">
              Search with AI
            </Button>
          </div>
          <FeaturedListingsGrid listings={listings.map(toBrowseListing)} />
        </div>
      </SectionContainer>

      <SectionDivider />

      <HomeEvents />

      <SectionDivider />

      <TopRatedProfessionals />

      <SectionDivider />

      <HomeListCta />

      <SectionDivider />

      <HomeFaq />
    </PageSections>
  );
}
