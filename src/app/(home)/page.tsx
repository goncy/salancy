import api from "@/api";

import HomePageClient from "./page.client";

// Force static generation
export const dynamic = "force-static";

// Revalidate every month
export const revalidate = 60 * 60 * 24 * 7 * 4;

export default async function Home() {
  const salaries = await api.salary.list();
  const dollarPrice = await api.dollar.price();
  const inflation = await api.inflation.fetch();
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
