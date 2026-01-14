import salaryApi from "@/salary/api";
import indicesApi from "@/index/api";
import { calculateMeanSalaries } from "@/salary/utils";
import FilterSheet from "@/filter/components/filters-sheet";
import FAQSheet from "@/core/components/faq-sheet";

import HomePageClient from "./page.client";
import { ThemeButton } from "@/core/components/theme-button";

export default async function Home() {
  // Fetch all required data in parallel
  const [salaries, categories, inflation] = await Promise.all([
    salaryApi.salary.list(),
    salaryApi.salary.category.list(),
    indicesApi.inflation.index(),
  ]);

  // Process raw salaries into mean values. We pass the inflation because we have a filter to show originald values
  const meanSalaries = calculateMeanSalaries(salaries, inflation);

  return (
    <div className="container m-auto flex h-screen flex-col gap-4 overflow-hidden bg-background p-4 font-sans antialiased">
      {/* Header including logo and filter sheet */}
      <header className="flex items-center justify-between">
        <b className="text-xl font-bold">💸 Salancy</b>
        <nav className="flex items-center gap-2">
          <FAQSheet salariesCount={salaries.length} />
          <FilterSheet />
          <ThemeButton />
        </nav>
      </header>

      {/* Main section containing the salary tables */}
      <main className="min-h-0 flex-1 overflow-hidden">
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
  );
}
