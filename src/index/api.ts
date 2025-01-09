import {unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag} from "next/cache";

import mocks from "@/mocks";

const api = {
  inflation: {
    index: async (): Promise<number> => {
      "use cache";

      cacheLife("months");
      cacheTag("inflation");

      if (process.env.IS_OFFLINE) {
        return mocks.inflation;
      }

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
