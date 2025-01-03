import type {USDPrice} from "./types";

import {unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag} from "next/cache";

const api = {
  usd: {
    price: async (): Promise<USDPrice> => {
      "use cache";

      cacheLife("months");
      cacheTag("usd");

      // Get the price from Dolarito
      const price = await fetch("https://www.dolarito.ar/api/frontend/quotations/dolar", {
        headers: {
          "auth-client": process.env.DOLARITO_TOKEN!,
        },
      })
        .then(
          (res) => res.json() as Promise<Record<string, {name: string; buy: number; sell: number}>>,
        )
        .then((prices) => prices["oficial"].sell);

      return {
        old: Number(process.env.NEXT_PUBLIC_ORIGINAL_DOLLAR_PRICE),
        actual: Number(price),
      };
    },
  },
  inflation: {
    index: async (): Promise<number> => {
      "use cache";

      cacheLife("months");
      cacheTag("inflation");

      // Get inflation data from Dolarito
      const inflation = await fetch(
        "https://www.dolarito.ar/api/frontend/indices/inflacionMensual",
        {
          headers: {
            "auth-client": process.env.DOLARITO_TOKEN!,
          },
        },
      ).then((res) => res.json() as Promise<Record<string, number>>);

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
};

export default api;
