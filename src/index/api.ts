import {unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag} from "next/cache";

const api = {
  inflation: {
    index: async (): Promise<number> => {
      "use cache";

      cacheLife("months");
      cacheTag("inflation");

      // Get inflation data from Dolarito
      const inflation = await fetch(
        "https://api.dolarito.ar/api/frontend/indices/inflacionMensual",
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
          return total * (1 + parseFloat(value) / 100);
        }

        return total;
      }, 1); // We start the total with 1 for multiplicative identity

      // Convert back from compounded total to percentage rate
      const accumulatedRate = (accumulated - 1) * 100;

      // Round it to 2 decimals
      return Math.round(accumulatedRate * 100) / 100;
    },
  },
};

export default api;
