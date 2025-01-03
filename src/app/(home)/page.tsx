import salaryApi from "@/salary/api";

import HomePageClient from "./page.client";

export default async function Home() {
  const salaries = await salaryApi.salary.mean.list();

  return <HomePageClient salaries={salaries} />;
}
