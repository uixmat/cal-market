import { countries as countryDataList } from "country-data-list";

export interface CountryOption {
  alpha2: string;
  alpha3: string;
  label: string;
  value: string;
}

const defaultCityByCountry: Record<string, string> = {
  AU: "Sydney",
  CA: "Toronto",
  DE: "Berlin",
  ES: "Madrid",
  FR: "Paris",
  GB: "London",
  IE: "Dublin",
  IN: "Mumbai",
  IT: "Rome",
  JP: "Tokyo",
  MX: "Mexico City",
  NL: "Amsterdam",
  NZ: "Auckland",
  SG: "Singapore",
  US: "San Francisco",
};

export const countryOptions: CountryOption[] = countryDataList.all
  .filter(
    (country) =>
      country.emoji &&
      country.status !== "deleted" &&
      country.ioc !== "PRK" &&
      country.name
  )
  .map((country) => ({
    alpha2: country.alpha2,
    alpha3: country.alpha3,
    label: country.name,
    value: country.alpha2,
  }))
  .toSorted((a, b) => a.label.localeCompare(b.label));

export const defaultCountry =
  countryOptions.find((country) => country.alpha2 === "US") ??
  countryOptions[0];

export function getCountryByAlpha2(alpha2: string): CountryOption | undefined {
  return countryOptions.find((country) => country.alpha2 === alpha2);
}

export function getLocationLabel(country: CountryOption): string {
  return defaultCityByCountry[country.alpha2] ?? country.label;
}

export const locationStorageKey = "discover-country";
