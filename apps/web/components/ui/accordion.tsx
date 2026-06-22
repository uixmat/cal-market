"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import type React from "react";

import { cn } from "@/lib/utils";

export function Accordion(
  props: AccordionPrimitive.Root.Props
): React.ReactElement {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

export function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.Item.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b last:border-b-0", className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

const accordionTriggerVariants = cva(
  "flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md text-left outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64",
  {
    defaultVariants: {
      indicator: "chevron",
      size: "default",
    },
    variants: {
      indicator: {
        chevron: "data-panel-open:*:data-[slot=accordion-indicator]:rotate-180",
        plus: "data-panel-open:*:data-[slot=accordion-indicator]:rotate-45",
      },
      size: {
        default: "py-4 font-medium text-sm",
        lg: "py-6 font-semibold text-base sm:text-lg",
      },
    },
  }
);

const accordionIndicatorVariants = cva(
  "pointer-events-none shrink-0 opacity-80 transition-transform duration-200 ease-in-out",
  {
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "size-4 translate-y-0.5",
        lg: "size-5 translate-y-1",
      },
    },
  }
);

export interface AccordionTriggerProps
  extends
    AccordionPrimitive.Trigger.Props,
    VariantProps<typeof accordionTriggerVariants> {}

export function AccordionTrigger({
  children,
  className,
  indicator = "chevron",
  size = "default",
  ...props
}: AccordionTriggerProps): React.ReactElement {
  const IndicatorIcon = indicator === "plus" ? PlusIcon : ChevronDownIcon;

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(accordionTriggerVariants({ className, indicator, size }))}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <IndicatorIcon
          className={accordionIndicatorVariants({ size })}
          data-slot="accordion-indicator"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionPanel({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props): React.ReactElement {
  return (
    <AccordionPrimitive.Panel
      className="h-(--accordion-panel-height) overflow-hidden text-muted-foreground text-sm transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0"
      data-slot="accordion-panel"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { AccordionPrimitive, AccordionPanel as AccordionContent };
