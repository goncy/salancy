import HomePageClient from "./page.client";

import api from "@/api";

// Force static generation
export const dynamic = "force-static";

// Revalidate every week
export const revalidate = 604800;

export default async function Home() {
  // Fetch all data in parallel
  const [salaries, dollarPrice, inflation] = await Promise.all([
    api.salary.list(),
    api.dollar.price(),
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
