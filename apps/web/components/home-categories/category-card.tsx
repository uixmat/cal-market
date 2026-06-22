"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";

import type { HomeCategory } from "@/components/home-categories/categories";
import { cn } from "@/lib/utils";

export function CategoryCard({
  alt,
  href,
  imageUrl,
  title,
}: HomeCategory): React.ReactElement {
  const reducedMotion = useReducedMotion();

  return (
    <Link
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      href={href}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reducedMotion ? undefined : { scale: 1.08 }}
        >
          <Image
            alt={alt}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 50vw, 20vw"
            src={imageUrl}
          />
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/30 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        />

        <span
          className={cn(
            "text-fluid text-fluid-category pointer-events-none absolute inset-x-0 bottom-0 p-3 font-heading font-semibold text-white tracking-tight transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-1.5 sm:p-4"
          )}
        >
          {title}
        </span>
      </div>
    </Link>
  );
}
