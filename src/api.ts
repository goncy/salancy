import type {Salary} from "./types";

const api = {
  dollar: {
    price: async (): Promise<number> => {
      const dolar = await fetch("https://www.bancoprovincia.com.ar/Principal/Dolar", {
        next: {revalidate: 60 * 60 * 24 * 7},
      })
        .then((res) => res.json() as Promise<[string, string, string]>)
        .then(([, value]) => value);

      return Number(dolar);
    },
  },
  salary: {
    list: async (): Promise<Salary[]> => {
      const salaries = await fetch(process.env.SHEETS_URL!)
        .then((res) => res.text())
        .then((res) =>
          res
            .split("\n")
            .slice(1)
            .map((row) => {
              const [date, position, currency, value, seniority] = row.split("\t");

              return {
                date,
                position: position.trim(),
                currency: currency.trim(),
                value: Number(value),
                seniority: seniority.trim(),
              };
            }),
        );

      const table = new Map<string, Salary>();

      for (const {position: title, currency, seniority, value} of salaries) {
        const key = `${title}-${currency}-${currency}-${seniority}`;

        if (!table.has(key)) {
          table.set(key, {title, currency, value, seniority, count: 0});
        }

        const salary = table.get(key)!;

        salary.count++;
        salary.value = (salary.value + value) / 2;
      }

      return Array.from(table.values()).sort((a, b) =>
        `${a.title}-${a.currency}-${a.seniority}`.localeCompare(
          `${b.title}-${b.currency}-${b.seniority}`,
        ),
      );
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
