import type {Category, RawSalary} from "./types";

import Papa from "papaparse";

import {cacheLife, cacheTag} from "next/cache";

const api = {
  salary: {
    list: async (): Promise<RawSalary[]> => {
      "use cache";

      cacheLife("months");
      cacheTag("salary");

      // Fetch raw CSV data from Google Sheets
      const csv = await fetch(process.env.NEXT_PUBLIC_SALARY_SHEET_URL!).then((res) => res.text());


      // Parse CSV data into RawSalary objects
      const {data} = Papa.parse<RawSalary>(csv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          switch (header) {
            case "Marca temporal":
              return "timestamp";
            case "Seniority":
              return "seniority";
            case "Salario bruto mensual":
              return "value";
            case "Posición":
              return "position";
            case "Moneda":
              return "currency";
            case "Pais de residencia":
              return "country";
            default:
              return header;
          }
        },
        transform: (value, column) => {
          switch (column) {
            // Parse salary value as integer
            case "value":
              return parseInt(value);
            default:
              return value;
          }
        },
      });

      return data
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
