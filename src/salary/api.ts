import type {MeanSalary, RawSalary, Salary} from "./types";

import {unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag} from "next/cache";

import indicesApi from "@/index/api";

import {calculateMeanSalaries} from "./utils";

const api = {
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
        const dollarPrice = await indicesApi.usd.price();
        const inflation = await indicesApi.inflation.index();

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
