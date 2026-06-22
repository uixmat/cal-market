"use client";

import { ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import type * as React from "react";
import { useEffect, useState } from "react";

import { CountryFlag } from "@/components/country-flag";
import { buttonVariants } from "@/components/ui/button";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import {
  countryOptions,
  defaultCountry,
  getCountryByAlpha2,
  getLocationLabel,
  locationStorageKey,
} from "@/lib/countries";
import type { CountryOption } from "@/lib/countries";
import { cn } from "@/lib/utils";

function isSameCountry(a: CountryOption, b: CountryOption): boolean {
  return a.alpha2 === b.alpha2;
}

export function LocationCountrySelector({
  className,
}: {
  className?: string;
}): React.ReactElement {
  const [selectedCountry, setSelectedCountry] =
    useState<CountryOption>(defaultCountry);

  useEffect(() => {
    const storedCountryCode = localStorage.getItem(locationStorageKey);
    if (!storedCountryCode) {
      return;
    }

    const storedCountry = getCountryByAlpha2(storedCountryCode);
    if (storedCountry) {
      setSelectedCountry(storedCountry);
    }
  }, []);

  const handleCountryChange = (
    country: CountryOption | CountryOption[] | null
  ): void => {
    if (!country || Array.isArray(country)) {
      return;
    }

    setSelectedCountry(country);
    localStorage.setItem(locationStorageKey, country.alpha2);
  };

  const locationLabel = getLocationLabel(selectedCountry);

  return (
    <Combobox
      isItemEqualToValue={isSameCountry}
      items={countryOptions}
      onValueChange={handleCountryChange}
      value={selectedCountry}
    >
      <ComboboxTrigger
        aria-label={`Current location: ${locationLabel}. Change country.`}
        className={cn(
          buttonVariants({ size: "default", variant: "ghost" }),
          "h-auto min-w-0 justify-between gap-2 px-2 py-1.5 font-normal text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CountryFlag countryCode={selectedCountry.alpha2} size="md" />
          <span className="truncate">{locationLabel}</span>
        </span>
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-60" />
      </ComboboxTrigger>

      <ComboboxPopup
        align="start"
        aria-label="Select country"
        className="min-w-64"
      >
        <div className="border-b p-2">
          <ComboboxInput
            aria-label="Search countries"
            placeholder="Search countries..."
            showTrigger={false}
            size="sm"
            startAddon={<SearchIcon />}
          />
        </div>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {(country: CountryOption) => (
            <ComboboxItem
              className="grid-cols-1 [&_.col-start-1]:hidden [&_.col-start-2]:col-start-1"
              key={country.alpha2}
              value={country}
            >
              <span className="flex items-center gap-2">
                <CountryFlag
                  countryCode={country.alpha2}
                  selected={country.alpha2 === selectedCountry.alpha2}
                />
                <span className="truncate">{country.label}</span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
