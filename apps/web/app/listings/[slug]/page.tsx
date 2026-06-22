import { getListingBySlug } from "@cal-market/agent-core";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteRailInset } from "@/components/layout/site-rail";
import {
  ListingDetailContent,
  ListingDetailImage,
} from "@/components/listing-detail/listing-detail-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  return (
    <SiteRailInset className="mx-auto w-full max-w-4xl py-10">
      <div className="mb-6">
        <Button render={<Link href="/search" />} variant="ghost">
          Back to browse
        </Button>
      </div>

      <Card className="overflow-hidden">
        <ListingDetailImage
          alt={listing.title}
          imageUrl={listing.imageUrl}
          priority
          sizes="(max-width: 896px) 100vw, 896px"
        />
        <ListingDetailContent listing={listing} />
      </Card>
    </SiteRailInset>
  );
}
