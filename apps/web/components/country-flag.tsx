import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { CircleFlag } from "react-circle-flags";

import { cn } from "@/lib/utils";

const countryFlagVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full [&_svg]:size-full",
  {
    defaultVariants: {
      size: "sm",
    },
    variants: {
      size: {
        md: "size-3.5",
        sm: "size-3",
      },
    },
  }
);

const flagHeights: Record<
  NonNullable<VariantProps<typeof countryFlagVariants>["size"]>,
  number
> = {
  md: 14,
  sm: 12,
};

export function CountryFlag({
  countryCode,
  selected = false,
  size,
  className,
}: {
  countryCode: string;
  selected?: boolean;
  size?: VariantProps<typeof countryFlagVariants>["size"];
  className?: string;
}): React.ReactElement {
  const sizeValue = size ?? "sm";

  return (
    <span
      className={cn(
        countryFlagVariants({ size: sizeValue }),
        selected && "ring-2 ring-white ring-offset-1 ring-offset-transparent",
        className
      )}
    >
      <CircleFlag
        countryCode={countryCode.toLowerCase()}
        height={flagHeights[sizeValue]}
      />
    </span>
  );
}
