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

      const table = new Map<string, {title: string; currency: string; values: number[]; seniority: string; count: number}>();

      for (const {position: title, currency, seniority, value} of salaries) {
        const key = `${title}-${currency}-${currency}-${seniority}`;

        if (!table.has(key)) {
          table.set(key, {title, currency, values: [], seniority, count: 0});
        }

        const salary = table.get(key)!;

        salary.count++;
        salary.values.push(value);
      }

      const calculateMedian = (values: number[]): number => {
        const sortedValues = values.sort((a, b) => a - b);
        const mid = Math.floor(sortedValues.length / 2);
        return sortedValues.length % 2 === 0 ? (sortedValues[mid - 1] + sortedValues[mid]) / 2 : sortedValues[mid];
      };

      const result = Array.from(table.values()).sort((a, b) =>
        `${a.title}-${a.currency}-${a.seniority}`.localeCompare(`${b.title}-${b.currency}-${b.seniority}`),
      );

      result.forEach((entry) => {
        entry.value = calculateMedian(entry.values);
        delete entry.values;
      });

      return result as Salary[];
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
