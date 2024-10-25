import type {DollarPrice, Options, Salary} from "./types";

const api = {
  dollarPrice: {
    fetch: async (): Promise<DollarPrice> => {
      const price = await fetch("https://www.bancoprovincia.com.ar/Principal/Dolar")
        .then((res) => res.json() as Promise<[string, string, string]>)
        .then(([, value]) => value);

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
    list: async (): Promise<Salary[]> => {
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
        positions: Array.from(positions).toSorted((a, b) => a.localeCompare(b)),
        currencies: Array.from(currencies).toSorted((a, b) => a.localeCompare(b)),
        seniorities: Array.from(seniorities),
      };
    },
  },
};

export default api;
