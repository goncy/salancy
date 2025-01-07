import salaryApi from "@/salary/api";
import indicesApi from "@/index/api";
import {calculateMeanSalaries} from "@/salary/utils";
import FilterSheet, {
  FilterSheetProvider,
  FilterSheetTrigger,
} from "@/filter/components/filters-sheet";

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

  return (
    <FilterSheetProvider>
      <div className="container m-auto grid h-screen grid-rows-[auto,1fr,auto] gap-4 overflow-hidden bg-background p-4 font-sans antialiased md:gap-4">
        {/* Header including logo and filter trigger */}
        <header className="flex items-center justify-between">
          <b className="text-xl font-bold">💸 Salancy</b>
          <FilterSheetTrigger />
        </header>

        {/* Main section containing the salary tables */}
        <main className="overflow-hidden">
          <HomePageClient categories={categories} salaries={meanSalaries} />;
        </main>

        {/* Footer with information about the poll date and the number of salaries reported */}
        <footer className="flex items-center justify-center text-balance text-center text-sm text-muted-foreground">
          <p>
            <a className="underline" href="https://github.com/goncy/salancy">
              Salancy
            </a>{" "}
            fue hecho con 🖤 por{" "}
            <a className="underline" href="https://goncy.dev">
              Goncy
            </a>
            . Datos registrados el{" "}
            {new Date(process.env.NEXT_PUBLIC_POLL_DATE!).toLocaleString(undefined, {
              dateStyle: "short",
            })}{" "}
            con {salaries.length} salarios reportados.
          </p>
        </footer>
      </div>

      {/* Filter sheet for the filters */}
      <FilterSheet />
    </FilterSheetProvider>
  );
}
