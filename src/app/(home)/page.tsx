import {unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife} from "next/cache";

import HomePageClient from "./page.client";

import api from "@/api";
import {calculateMeanSalaries, calculateOptions} from "@/utils";

export default async function Home() {
  "use cache";

  cacheLife("months");
  cacheTag("/");

  // Fetch all data in parallel
  const [salaries, dollarPrice, inflation] = await Promise.all([
    api.salary.list(),
    api.dollarPrice.fetch(),
    api.inflation.fetch(),
  ]);

  // Convert salaries to mean salaries
  const meanSalaries = calculateMeanSalaries(salaries, dollarPrice, inflation);

  // This one not just depends on salaries but it's not an actual external call
  const options = calculateOptions(meanSalaries);

  return <HomePageClient inflation={inflation} options={options} salaries={meanSalaries} />;
}
