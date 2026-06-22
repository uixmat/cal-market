import Image from "next/image";
import Link from "next/link";
import type * as React from "react";

import { CategoryBadge } from "@/components/category-badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  city: string;
  imageUrl: string;
  className?: string;
}

export function ListingCard({
  slug,
  title,
  description,
  category,
  city,
  imageUrl,
  className,
}: ListingCardProps): React.ReactElement {
  return (
    <Link
      className={cn(
        "group block transition-[filter] duration-300 ease-out motion-safe:hover:drop-shadow-md",
        className
      )}
      href={`/listings/${slug}`}
    >
      <Card className="listing-card gap-0 overflow-visible rounded-none border-0 p-0 shadow-none [&::before]:hidden">
        <div className="listing-card-image relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.08]">
            <Image
              alt={title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={imageUrl}
            />
          </div>
        </div>

        <div className="listing-card-body">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={category} />
                <div className="font-semibold text-xs">· {city}</div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardPanel className="pt-0">
            <p className="line-clamp-2 text-muted-foreground text-sm">
              {description}
            </p>
          </CardPanel>
        </div>
      </Card>
    </Link>
  );
}
