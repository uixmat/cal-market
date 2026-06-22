import Image from "next/image";
import type * as React from "react";

import { CategoryBadge } from "@/components/category-badge";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ListingDetailData {
  calLink: string;
  category: string;
  city: string;
  description: string;
  imageUrl: string;
  region: string;
  slug: string;
  title: string;
}

interface ListingDetailContentProps {
  listing: ListingDetailData;
  className?: string;
  titleId?: string;
}

export function ListingDetailContent({
  listing,
  className,
  titleId,
}: ListingDetailContentProps): React.ReactElement {
  return (
    <div className={cn("flex flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl sm:text-2xl" id={titleId}>
          {listing.title}
        </CardTitle>
        <CardDescription>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={listing.category} />
            <div className="font-semibold text-xs">
              · {listing.city}, {listing.region}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardPanel className="space-y-6 pt-0">
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
    </div>
  );
}

interface ListingDetailImageProps {
  alt: string;
  imageUrl: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function ListingDetailImage({
  alt,
  imageUrl,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 672px",
  className,
}: ListingDetailImageProps): React.ReactElement {
  return (
    <div
      className={cn("relative aspect-[16/9] w-full overflow-hidden", className)}
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        priority={priority}
        sizes={sizes}
        src={imageUrl}
      />
    </div>
  );
}
