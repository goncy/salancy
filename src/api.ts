import type {DollarPrice, MeanSalary, RawSalary, Salary} from "./types";

import {unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag} from "next/cache";

import {calculateMeanSalaries} from "@/utils/salary";

const api = {
  dollarPrice: {
    fetch: async (): Promise<DollarPrice> => {
      const price = await fetch("https://www.dolarito.ar/api/frontend/quotations/dolar", {
        headers: {
          "auth-client": process.env.DOLARITO_TOKEN!,
        },
      })
        .then(
          (res) => res.json() as Promise<Record<string, {name: string; buy: number; sell: number}>>,
        )
        .then((prices) => prices["oficial"].sell);

      return {
        old: Number(process.env.NEXT_PUBLIC_ORIGINAL_DOLLAR_PRICE),
        actual: Number(price),
      };
    },
  },
  inflation: {
    fetch: async (): Promise<number> => {
      // Get inflation data from Dolarito
      const inflation = await fetch(
        "https://www.dolarito.ar/api/frontend/indices/inflacionMensual",
        {
          headers: {
            "auth-client": process.env.DOLARITO_TOKEN!,
          },
        },
      ).then((res) => res.json() as Promise<Record<string, number>>);

      // Get the inflation from the date the poll was made
      const startDate = new Date(process.env.NEXT_PUBLIC_POLL_DATE!);

      // Get accumulated inflation since the poll date
      const accumulated = Object.entries(inflation).reduce((total, [date, value]) => {
        const [day, month, year] = date.split("-");

        if (new Date(parseInt(year), parseInt(month) - 1, parseInt(day)) > startDate) {
          return total + value;
        }

        return total;
      }, 0);

      // Round it to 2 decimals
      return Math.round(accumulated * 100) / 100;
    },
  },
  salary: {
    list: async (): Promise<RawSalary[]> => {
      "use cache";

      cacheLife("months");
      cacheTag("salary");

      // Get list of salaries
      const csv = await fetch(process.env.NEXT_PUBLIC_SHEET_URL!).then((res) => res.text());

      // Convert from csv row to salary
      return csv
        .split("\n")
        .slice(1)
        .map((row) => {
          const [, position, currency, value, seniority] = row.split("\t");

          return {
            position: position.trim(),
            currency: currency.trim() as RawSalary["currency"],
            value: parseInt(value),
            seniority: seniority.trim(),
          };
        }) as RawSalary[];
    },
    mean: {
      list: async (): Promise<MeanSalary[]> => {
        const rawSalaries = await api.salary.list();
        const dollarPrice = await api.dollarPrice.fetch();
        const inflation = await api.inflation.fetch();

        return calculateMeanSalaries(rawSalaries, dollarPrice, inflation);
      },
    },
    metadata: async () => {
      const salaries = await api.salary.list();

      const positions = new Set<Salary["position"]>();
      const currencies = new Set<Salary["currency"]>();
      const seniorities = new Set<Salary["seniority"]>();

      for (const {position, currency, seniority} of salaries) {
        positions.add(position);
        currencies.add(currency);
        seniorities.add(seniority);
      }

      return {
        positions: Array.from(positions).toSorted((a, b) => a.localeCompare(b)),
        currencies: Array.from(currencies).toSorted((a, b) => a.localeCompare(b)),
        seniorities: Array.from(seniorities).toSorted((a, b) => a.localeCompare(b)),
      };
    },
  },
};

export default api;
