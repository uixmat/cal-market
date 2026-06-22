import { ChevronRightIcon } from "lucide-react";
import type * as React from "react";

import { homeFaqItems } from "@/components/home-faq/faq-items";
import { SectionHeader } from "@/components/layout/section-header";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function HomeFaq(): React.ReactElement {
  return (
    <section aria-label="Frequently asked questions about Discover">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10">
        <SectionHeader
          align="center"
          badge="FAQ"
          description="Common questions from people listing and booking local services."
          title="Frequently asked questions about Discover"
        />

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

        <Accordion className="w-full" defaultValue={["list"]}>
          {homeFaqItems.map((item) => (
            <AccordionItem
              className="border-border border-b first:border-t"
              key={item.id}
              value={item.id}
            >
              <AccordionTrigger indicator="plus" size="lg">
                {item.question}
              </AccordionTrigger>
              <AccordionPanel className="max-w-3xl pb-6 text-base sm:text-base">
                {item.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
