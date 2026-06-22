import { ChevronRightIcon } from "lucide-react";
import type * as React from "react";

import { SectionContainer } from "@/components/layout/section-container";
import { TextFlipSlot } from "@/components/text-flip-slot";
import { Button } from "@/components/ui/button";
import { listCtaFlipWords } from "@/lib/flip-words";

export function HomeListCta(): React.ReactElement {
  return (
    <SectionContainer className="relative overflow-hidden">
      <div
        aria-hidden
        className="home-cta-grid pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
        <div>
          <h2 className="text-balance font-heading font-semibold text-3xl tracking-tight sm:text-4xl">
            List your <TextFlipSlot interval={2.75} words={listCtaFlipWords} />{" "}
            on Discover
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            Reach people looking for bookable local services — no commissions,
            no risk. Connect your Cal.com scheduling link and start getting
            booked.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            render={
              <a
                aria-label="Get started on Cal.com"
                href="https://cal.com/signup"
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="lg"
          >
            Get started
            <ChevronRightIcon aria-hidden="true" />
          </Button>
          <Button
            render={
              <a
                aria-label="Learn more about Cal.com"
                href="https://cal.com"
                rel="noopener noreferrer"
                target="_blank"
              />
            }
            size="lg"
            variant="secondary"
          >
            Learn more
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
