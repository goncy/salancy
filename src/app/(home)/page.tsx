import type {Salary} from "@/types";

import api from "@/api";

import HomePageClient from "./page.client";

export default async function Home({searchParams}: {searchParams: Record<string, string>}) {
  const filters = {
    position: searchParams.position || "",
    currency: searchParams.currency || "",
    seniority: searchParams.seniority || "",
    sort: (searchParams.sort as null | keyof Salary) || "title",
    simulate: searchParams.simulate === "true",
    direction: (searchParams.direction as "asc" | "desc" | null) || "asc",
  };

  const salaries = await api.salary.list(filters);
  const dollarPrice = await api.dollar.price();
  const {currencies, seniorities, positions} = await api.salary.filters(salaries);

  return (
    <HomePageClient
      dollarPrice={dollarPrice}
      filters={{
        currency: {
          options: currencies,
          value: filters.currency,
        },
        position: {
          options: positions,
          value: filters.position,
        },
        seniority: {
          options: seniorities,
          value: filters.seniority,
        },
        sort: filters.sort,
        simulate: filters.simulate,
        direction: filters.direction,
      }}
      salaries={salaries}
    />
  );
}
