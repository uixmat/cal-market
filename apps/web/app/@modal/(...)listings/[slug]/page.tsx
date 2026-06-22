import { getListingBySlug } from "@cal-market/agent-core";
import { notFound } from "next/navigation";

import { ListingDetailModal } from "@/components/listing-detail/listing-detail-modal";

export const dynamic = "force-dynamic";

interface ListingModalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ListingModalPage({
  params,
}: ListingModalPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  return <ListingDetailModal listing={listing} slug={slug} />;
}
