import { getListingBySlug } from "@cal-market/agent-core";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteRailInset } from "@/components/layout/site-rail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";

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
        <Button render={<Link href="/" />} variant="ghost">
          Back to browse
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9] w-full">
          <Image
            alt={listing.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            src={listing.imageUrl}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{listing.title}</CardTitle>
          <CardDescription>
            {listing.category.replaceAll("-", " ")} · {listing.city},{" "}
            {listing.region}
          </CardDescription>
        </CardHeader>
        <CardPanel className="space-y-6">
          <p className="text-base leading-relaxed">{listing.description}</p>
          <Button
            render={
              <a
                aria-label={`Book ${listing.title} on Cal.com`}
                href={listing.calLink}
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="lg"
          >
            Book on Cal.com
          </Button>
        </CardPanel>
      </Card>
    </SiteRailInset>
  );
}
