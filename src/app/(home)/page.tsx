import api from "@/api";

import HomePageClient from "./page.client";

export default async function Home() {
  const salaries = await api.salary.list();
  const dollarPrice = await api.dollar.price();
  const {currencies, seniorities, positions} = api.salary.filters(salaries);

  return (
    <HomePageClient
      currencies={currencies}
      dollarPrice={dollarPrice}
      positions={positions}
      salaries={salaries}
      seniorities={seniorities}
    />
  );
}
