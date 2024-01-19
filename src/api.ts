import type {Options, Salary} from "./types";

const api = {
  dollar: {
    price: async (): Promise<{old: number; actual: number}> => {
      const dolar = await fetch("https://www.bancoprovincia.com.ar/Principal/Dolar", {
        next: {
          tags: ["dolar"],
        },
      })
        .then((res) => res.json() as Promise<[string, string, string]>)
        .then(([, value]) => value);

      return {
        old: Number(process.env.NEXT_PUBLIC_ORIGINAL_DOLLAR_PRICE),
        actual: Number(dolar),
      };
    },
  },
  salary: {
    list: async (): Promise<Salary[]> => {
      // Get list of salaries
      const csv = await fetch(process.env.SHEETS_URL!, {
        next: {
          tags: ["salaries"],
        },
      }).then((res) => res.text());

      // Convert from csv row to salary
      return csv
        .split("\n")
        .slice(1)
        .map((row) => {
          const [, position, currency, value, seniority] = row.split("\t");

          return {
            position: position.trim(),
            currency: currency.trim() as Salary["currency"],
            value: parseInt(value),
            seniority: seniority.trim(),
          };
        });
    },
  },
  options: {
    list: async (salaries: Salary[]): Promise<Options> => {
      const positions = new Set<Salary["position"]>();
      const currencies = new Set<Salary["currency"]>();
      const seniorities = new Set<Salary["seniority"]>();

      for (const {position, currency, seniority} of salaries) {
        positions.add(position);
        currencies.add(currency);
        seniorities.add(seniority);
      }

      return {
        positions: Array.from(positions),
        currencies: Array.from(currencies),
        seniorities: Array.from(seniorities),
      };
    },
  },
};

export default api;
