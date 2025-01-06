import salaryApi from "@/salary/api";
import indicesApi from "@/index/api";
import {calculateMeanSalaries} from "@/salary/utils";

import HomePageClient from "./page.client";

export default async function Home() {
  // Fetch all required data in parallel
  const [salaries, categories, inflation] = await Promise.all([
    salaryApi.salary.list(),
    salaryApi.salary.category.list(),
    indicesApi.inflation.index(),
  ]);

  // Process raw salaries into mean values. We pass the inflation because we have a filter to show simulated values
  const meanSalaries = calculateMeanSalaries(salaries, inflation);

  return <HomePageClient categories={categories} salaries={meanSalaries} />;
}
