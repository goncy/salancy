import api from "@/api";

import HomePageClient from "./page.client";

export default async function Home() {
  const salaries = await api.salary.list();
  const dollarPrice = await api.dollar.price();
  const options = await api.options.list(salaries);

  return <HomePageClient dollarPrice={dollarPrice} options={options} salaries={salaries} />;
}
