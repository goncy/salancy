import type {Category, RawSalary} from "./types";

import {unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag} from "next/cache";

const api = {
  salary: {
    list: async (): Promise<RawSalary[]> => {
      "use cache";

      cacheLife("months");
      cacheTag("salary");

      // Fetch raw CSV data from Google Sheets
      const csv = await fetch(process.env.NEXT_PUBLIC_SHEET_URL!).then((res) => res.text());

      // Parse CSV rows into RawSalary objects, skipping the header row
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
    category: {
      list: async (): Promise<Category[]> => {
        "use cache";

        cacheLife("months");
        cacheTag("category");

        // Fetch category data from Google Sheets
        const data = await fetch(process.env.NEXT_PUBLIC_CATEGORY_SHEET_URL!).then((res) =>
          res.text(),
        );

        // Parse header row to create category objects
        const [header, ...rows] = data.split("\n");
        const categories: Category[] = header
          .trim()
          .split("\t")
          .filter(Boolean)
          .map((name) => ({name, positions: []}));

        // Parse each row and assign positions to their respective categories
        // Each column in a row corresponds to a position in that category
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
