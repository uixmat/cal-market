"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

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
}: ListingCardProps) {
  return (
    <Link className={cn("group block", className)} href={`/listings/${slug}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.08 }}
          >
            <Image
              alt={title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={imageUrl}
            />
          </motion.div>
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {category.replaceAll("-", " ")} · {city}
          </CardDescription>
        </CardHeader>
        <CardPanel className="pt-0">
          <p className="line-clamp-2 text-muted-foreground text-sm">
            {description}
          </p>
        </CardPanel>
      </Card>
    </Link>
  );
}
