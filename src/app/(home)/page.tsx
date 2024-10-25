import {unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife} from "next/cache";

import HomePageClient from "./page.client";

import api from "@/api";

export default async function Home() {
  "use cache";

  cacheLife("max");
  cacheTag("/");

  // Fetch all data in parallel
  const [salaries, dollarPrice, inflation] = await Promise.all([
    api.salary.list(),
    api.dollarPrice.fetch(),
    api.inflation.fetch(),
  ]);

  // This one not just depends on salaries but it's not an actual external call
  const options = await api.options.list(salaries);

  return (
    <HomePageClient
      dollarPrice={dollarPrice}
      inflation={inflation}
      options={options}
      salaries={salaries}
    />
  );
}
