import type {Salary} from "./types";

const api = {
  dollar: {
    price: async (): Promise<number> => {
      const dolar = await fetch("https://www.bancoprovincia.com.ar/Principal/Dolar", {
        next: {
          tags: ["dolar"],
        },
      })
        .then((res) => res.json() as Promise<[string, string, string]>)
        .then(([, value]) => value);

      return Number(dolar);
    },
  },
  salary: {
    list: async (): Promise<Salary[]> => {
      const salaries = await fetch(process.env.SHEETS_URL!, {
        next: {
          tags: ["salaries"],
        },
      })
        .then((res) => res.text())
        .then((res) =>
          res
            .split("\n")
            .slice(1)
            .map((row) => {
              const [date, title, currency, value, seniority] = row.split("\t");

              return {
                date,
                title: title.trim(),
                currency: currency.trim(),
                value: parseInt(value),
                seniority: seniority.trim(),
              };
            }),
        );

      const table = new Map<string, Omit<Salary, "count">[]>();

      for (const salary of salaries) {
        const key = `${salary.title}-${salary.currency}-${salary.seniority}`;

        if (!table.has(key)) {
          table.set(key, []);
        }

        const item = table.get(key)!;

        item.push(salary);
      }

      return Array.from(table.values()).map((category) => {
        const sum = category.reduce((acc, salary) => acc + salary.value, 0);

        return {
          ...category[0],
          count: category.length,
          value: sum / category.length,
        };
      });
    },
    filters: (
      salaries: Salary[],
    ): {positions: string[]; currencies: string[]; seniorities: string[]} => {
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
