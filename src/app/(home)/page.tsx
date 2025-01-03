import {unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife} from "next/cache";

import api from "@/api";

import HomePageClient from "./page.client";

export default async function Home() {
  "use cache";

  cacheLife("months");
  cacheTag("/");

  const salaries = await api.salary.mean.list();

  return <HomePageClient salaries={salaries} />;
}
