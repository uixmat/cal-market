import { getFeaturedListings } from "@cal-market/agent-core";
import Link from "next/link";

import { PageSections } from "@/components/layout/page-sections";
import { SectionDivider } from "@/components/layout/rail-divider";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeader } from "@/components/layout/section-header";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const listings = await getFeaturedListings(12);

  return (
    <PageSections>
      <SectionContainer>
        <SectionHeader
          actions={
            <>
              <Button render={<Link href="/search" />} size="lg">
                Try AI search
              </Button>
              <Button render={<Link href="/" />} size="lg" variant="outline">
                Browse listings
              </Button>
            </>
          }
          align="center"
          badge="Cal.com side project"
          description="A no-commission marketplace for dentists, vets, instructors, clubs, and more — powered by Cal.com scheduling links."
          title="Discover local services you can book instantly"
        />
      </SectionContainer>

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                category={listing.category}
                city={listing.city}
                description={listing.description}
                imageUrl={listing.imageUrl}
                key={listing.id}
                slug={listing.slug}
                title={listing.title}
              />
            ))}
          </div>
        </div>
      </SectionContainer>
    </PageSections>
  );
}
