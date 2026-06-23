import {
  BadgeCheckIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  VideoIcon,
} from "lucide-react";
import type * as React from "react";

import type { TopRatedProfessional } from "@/components/top-rated-professionals/professionals";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.replaceAll(".", "").charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopRatedProfessionalCard({
  professional,
}: {
  professional: TopRatedProfessional;
}): React.ReactElement {
  return (
    <Card className="flex-row gap-3 p-4 sm:gap-5 sm:p-5">
      <Avatar className="size-14 shrink-0 self-start sm:size-16">
        <AvatarImage alt={professional.name} src={professional.avatarUrl} />
        <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex max-sm:flex-col max-sm:gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-semibold text-base">
              {professional.name}
            </p>
            <p className="truncate text-muted-foreground text-sm">
              {professional.title}
            </p>
          </div>

          <div className="max-sm:text-left sm:shrink-0 sm:text-right">
            <p className="font-semibold text-base tabular-nums">
              {professional.price}
            </p>
            <p className="text-muted-foreground text-xs">
              {professional.priceUnit}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1 font-medium tabular-nums">
              <StarIcon
                aria-hidden="true"
                className="size-3.5 fill-amber-400 text-amber-400"
              />
              {professional.rating.toFixed(1)} ({professional.reviewCount})
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
              {professional.city}, {professional.region}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {professional.tags.map((tag) => (
              <Badge key={tag.label} size="sm" variant="outline">
                {tag.icon === "video" ? (
                  <VideoIcon aria-hidden="true" className="opacity-80" />
                ) : null}
                {tag.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex max-sm:flex-col max-sm:items-stretch max-sm:gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground text-xs">
            {professional.verified ? (
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                <BadgeCheckIcon
                  aria-hidden="true"
                  className="size-3.5 text-info"
                />
                Verified
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <ClockIcon aria-hidden="true" className="size-3.5" />
              {professional.availability}
            </span>
          </div>

          <Button
            className="max-sm:w-full sm:w-auto"
            render={
              <a
                aria-label={`Book ${professional.name}`}
                href={professional.calLink}
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="sm"
          >
            <CalendarIcon aria-hidden="true" />
            Book
          </Button>
        </div>
      </div>
    </Card>
  );
}
