"use client";

import { frame, motion, useMotionValue } from "motion/react";
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
import {
  listingImageLayoutId,
  listingLayoutId,
  LISTING_MODAL_Z_INDEX,
} from "@/lib/listing-layout";
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
  const zIndex = useMotionValue(0);

  function elevateCard(): void {
    zIndex.set(LISTING_MODAL_Z_INDEX);
  }

  return (
    <Link
      className={cn(
        "group relative block transition-[filter] duration-300 ease-out motion-safe:hover:drop-shadow-md",
        className
      )}
      href={`/listings/${slug}`}
      onPointerDown={elevateCard}
      scroll={false}
    >
      <motion.div
        className="listing-card relative overflow-hidden rounded-none bg-card will-change-transform"
        layoutId={listingLayoutId(slug)}
        onLayoutAnimationComplete={() => zIndex.set(0)}
        onLayoutAnimationStart={elevateCard}
        onTap={() => {
          frame.postRender(elevateCard);
        }}
        style={{ zIndex }}
      >
        <Card className="gap-0 overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none [&::before]:hidden">
          <motion.div
            className="listing-card-image relative aspect-[4/3] overflow-hidden will-change-transform"
            layoutId={listingImageLayoutId(slug)}
            style={{ zIndex }}
          >
            <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.08]">
              <Image
                alt={title}
                className="object-cover"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                src={imageUrl}
              />
            </div>
          </motion.div>

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
      </motion.div>
    </Link>
  );
}
