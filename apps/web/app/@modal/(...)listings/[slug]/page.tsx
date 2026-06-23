import { ListingDetailModalRoute } from "@/components/listing-detail/listing-detail-modal-route";

interface ListingModalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ListingModalPage({
  params,
}: ListingModalPageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  return <ListingDetailModalRoute slug={slug} />;
}
