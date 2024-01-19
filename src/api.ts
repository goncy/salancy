import type {Salary} from "./types";

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
    list: async (filters: {
      position: Salary["title"];
      currency: Salary["currency"];
      seniority: Salary["seniority"];
      sort: keyof Salary;
      simulate: boolean;
      direction: "asc" | "desc";
    }): Promise<Salary[]> => {
      // Get dollar prices
      const dollarPrice = await api.dollar.price();

      // Get list of salaries
      const csv = await fetch(process.env.SHEETS_URL!, {
        next: {
          tags: ["salaries"],
        },
      }).then((res) => res.text());

      // Prepare map to group salaries by title-currency-seniority
      const table = new Map<string, Salary>();

      // Convert from csv row to salary
      csv
        .split("\n")
        .slice(1)
        .forEach((row) => {
          const [, title, currency, value, seniority] = row.split("\t");

          const salary = {
            title: title.trim(),
            currency: currency.trim(),
            value: parseInt(value),
            seniority: seniority.trim(),
          };

          // Omit the elements not matching with the filters
          if (
            (filters.currency && salary.currency !== filters.currency) ||
            (filters.seniority && salary.seniority !== filters.seniority) ||
            (filters.position && salary.title !== filters.position)
          ) {
            return;
          }

          // If simulating, convert to current USD price
          if (filters.simulate) {
            salary.value = salary.value * (dollarPrice.actual / dollarPrice.old);
          }

          // Create an identifier key
          const key = `${salary.title}-${salary.currency}-${salary.seniority}`;

          // If key is not on the table, create it
          if (!table.has(key)) {
            table.set(key, {
              ...salary,
              value: 0,
              count: 0,
            });
          }

          // Get the item
          const item = table.get(key)!;

          // Push it to the table
          item.value += salary.value;
          item.count++;
        });

      // Create salary list with mean values
      return Array.from(table.values())
        .map((salary) => ({...salary, value: salary.value / salary.count}))
        .sort((a, b) => {
          // Filter by currency
          if (filters.sort === "value") {
            const valueA = a.currency === "USD" ? a.value * dollarPrice.actual : a.value;
            const valueB = b.currency === "USD" ? b.value * dollarPrice.actual : b.value;

            return filters.direction === "asc" ? valueA - valueB : valueB - valueA;
          }

          // Filter by count
          if (filters.sort === "count") {
            return filters.direction === "asc" ? a.count - b.count : b.count - a.count;
          }

          // Filter by the rest
          return filters.direction === "asc"
            ? String(a[filters.sort]).localeCompare(String(b[filters.sort]))
            : String(b[filters.sort]).localeCompare(String(a[filters.sort]));
        });
    },
    filters: async (
      salaries: Salary[],
    ): Promise<{positions: string[]; currencies: string[]; seniorities: string[]}> => {
      const titles = new Set<string>();
      const currencies = new Set<string>();
      const seniorities = new Set<string>();

      for (const {title, currency, seniority} of salaries) {
        titles.add(title);
        currencies.add(currency);
        seniorities.add(seniority);
      }

      return {
        positions: Array.from(titles),
        currencies: Array.from(currencies),
        seniorities: Array.from(seniorities),
      };
    },
  },
};

export default api;
