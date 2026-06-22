"use client";

import { XIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { ListingDetailContent } from "@/components/listing-detail/listing-detail-content";
import type { ListingDetailData } from "@/components/listing-detail/listing-detail-content";
import { Button } from "@/components/ui/button";
import {
  listingImageLayoutId,
  listingLayoutId,
  LISTING_MODAL_Z_INDEX,
} from "@/lib/listing-layout";
import { cn } from "@/lib/utils";

const smoothEaseOut = [0, 0.42, 0.34, 0.98] as const;

interface ListingDetailModalLayerProps {
  close: () => void;
  listing: ListingDetailData;
  reducedMotion: boolean;
  slug: string;
}

function ListingDetailModalLayer({
  close,
  listing,
  reducedMotion,
  slug,
}: ListingDetailModalLayerProps): React.ReactElement {
  const zIndex = useMotionValue(LISTING_MODAL_Z_INDEX);

  return (
    <>
      <motion.button
        animate={{ opacity: 1 }}
        aria-label="Close listing details"
        className="fixed inset-0 cursor-default bg-black/55"
        exit={{
          opacity: 0,
          transition: { duration: 0.18, ease: smoothEaseOut },
        }}
        initial={{ opacity: 0 }}
        onClick={close}
        style={{ zIndex: LISTING_MODAL_Z_INDEX - 1 }}
        type="button"
      />

      <div
        aria-labelledby={`listing-modal-title-${slug}`}
        aria-modal="true"
        className="pointer-events-none fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6"
        role="dialog"
        style={{ zIndex: LISTING_MODAL_Z_INDEX }}
      >
        <motion.div
          className={cn(
            "pointer-events-auto flex max-h-[min(92dvh,900px)] w-full min-w-0 max-w-2xl flex-col overflow-hidden bg-card shadow-2xl will-change-transform",
            "max-sm:max-h-[92dvh] max-sm:rounded-t-2xl sm:rounded-2xl"
          )}
          layoutId={listingLayoutId(slug)}
          onClick={(event) => event.stopPropagation()}
          onLayoutAnimationStart={() => zIndex.set(LISTING_MODAL_Z_INDEX)}
          style={{ zIndex }}
        >
          <motion.div
            className="relative aspect-video w-full shrink-0 overflow-hidden will-change-transform"
            layoutId={listingImageLayoutId(slug)}
          >
            <Image
              alt={listing.title}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 672px"
              src={listing.imageUrl}
            />
            <Button
              aria-label="Close"
              className="absolute end-3 top-3 bg-background/80 backdrop-blur-sm"
              onClick={close}
              size="icon"
              type="button"
              variant="ghost"
            >
              <XIcon />
            </Button>
          </motion.div>

          <motion.div
            animate={
              reducedMotion
                ? { opacity: 1, y: 0 }
                : {
                    opacity: 1,
                    transition: {
                      delay: 0.08,
                      duration: 0.22,
                      ease: smoothEaseOut,
                    },
                    y: 0,
                  }
            }
            className="min-h-0 flex-1 overflow-y-auto"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          >
            <ListingDetailContent
              listing={listing}
              titleId={`listing-modal-title-${slug}`}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

interface ListingDetailModalProps {
  listing: ListingDetailData;
  slug: string;
}

export function ListingDetailModal({
  listing,
  slug,
}: ListingDetailModalProps): React.ReactElement | null {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape" && open) {
        close();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, open]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <MotionConfig
      transition={
        reducedMotion
          ? { duration: 0 }
          : { bounce: 0, type: "spring", visualDuration: 0.28 }
      }
    >
      <AnimatePresence onExitComplete={handleExitComplete}>
        {open ? (
          <ListingDetailModalLayer
            close={close}
            listing={listing}
            reducedMotion={Boolean(reducedMotion)}
            slug={slug}
          />
        ) : null}
      </AnimatePresence>
    </MotionConfig>,
    document.body
  );
}
