"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type React from "react";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-transparent font-medium outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-3.5 sm:[&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button&,a&]:cursor-pointer [button&,a&]:pointer-coarse:after:absolute [button&,a&]:pointer-coarse:after:size-full [button&,a&]:pointer-coarse:after:min-h-11 [button&,a&]:pointer-coarse:after:min-w-11",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "h-5.5 min-w-5.5 px-[calc(--spacing(1)-1px)] text-sm sm:h-4.5 sm:min-w-4.5 sm:text-xs",
        lg: "h-6.5 min-w-6.5 px-[calc(--spacing(1.5)-1px)] text-base sm:h-5.5 sm:min-w-5.5 sm:text-sm",
        sm: "h-5 min-w-5 rounded-[.25rem] px-[calc(--spacing(1)-1px)] text-xs sm:h-4 sm:min-w-4 sm:text-[.625rem]",
      },
      variant: {
        dance:
          "bg-fuchsia-500/10 text-fuchsia-800 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
        default:
          "bg-primary text-primary-foreground [button&,a&]:hover:bg-primary/90",
        dentist:
          "bg-sky-500/10 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
        destructive:
          "bg-destructive text-white [button&,a&]:hover:bg-destructive/90",
        doctor:
          "bg-blue-500/10 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300",
        error:
          "bg-destructive/8 text-destructive-foreground dark:bg-destructive/16",
        fitness:
          "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
        info: "bg-info/8 text-info-foreground dark:bg-info/16",
        "mountain-biking":
          "bg-orange-500/10 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
        outline:
          "border-input bg-background text-foreground dark:bg-input/32 [button&,a&]:hover:bg-accent/50 dark:[button&,a&]:hover:bg-input/48",
        secondary:
          "bg-secondary text-secondary-foreground [button&,a&]:hover:bg-secondary/90",
        "ski-snowboard":
          "bg-cyan-500/10 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300",
        "social-club":
          "bg-violet-500/10 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
        sports:
          "bg-lime-600/10 text-lime-800 dark:bg-lime-500/20 dark:text-lime-300",
        success: "bg-success/8 text-success-foreground dark:bg-success/16",
        veterinarian:
          "bg-amber-500/10 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300",
        warning: "bg-warning/8 text-warning-foreground dark:bg-warning/16",
      },
    },
  }
);

export interface BadgeProps extends useRender.ComponentProps<"span"> {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
}

export function Badge({
  className,
  variant,
  size,
  render,
  ...props
}: BadgeProps): React.ReactElement {
  const defaultProps = {
    className: cn(badgeVariants({ className, size, variant })),
    "data-slot": "badge",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}
