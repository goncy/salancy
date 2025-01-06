import type {Category, RawSalary, Salary} from "./types";

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
      list: async (): Promise<Record<Salary["position"], Salary[]>> => {
        const rawSalaries = await api.salary.list();
        const inflation = await indicesApi.inflation.index();

        return calculateMeanSalaries(rawSalaries, inflation);
      },
    },
    category: {
      list: async (): Promise<Category[]> => {
        "use cache";

        cacheLife("months");
        cacheTag("category");

        const data = await fetch(process.env.NEXT_PUBLIC_CATEGORY_SHEET_URL!).then((res) =>
          res.text(),
        );

        // Split into rows and get the first row as headers
        const [header, ...rows] = data.split("\n");
        const categories: Category[] = header
          .trim()
          .split("\t")
          .filter(Boolean)
          .map((name) => ({name, positions: []}));

        for (const row of rows) {
          const columns = row.trim().split("\t");

          for (let column = 0; column < columns.length; column++) {
            const category = categories[column];
            const position = columns[column];

            if (category && position) {
              category.positions.push(position);
            }
          }
        }

        return categories;
      },
    },
  },
};

export default api;
