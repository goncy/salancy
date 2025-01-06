"use client";

import dynamic from "next/dynamic";

import type {Category, Salary} from "@/salary/types";
import {filterMeanSalaries, formatSalary} from "@/salary/utils";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {useFilters} from "@/filter/hooks/use-filters";

import HomePageLoading from "./loading";

function HomePageClient({salaries}: {salaries: Record<Salary["position"], Salary[]>}) {
  const [filters] = useFilters();

  if (Object.keys(salaries).length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No se encontraron resultados
      </div>
    );
  }

  return (
    <section className="grid h-full grid-cols-[repeat(auto-fill,minmax(480px,1fr))] content-start gap-8 overflow-auto">
      {Object.entries(salaries).map(([position, salaries]) => (
        <div key={position} className="flex flex-col gap-2">
          <p className="text-lg font-medium">{position}</p>
          <Table className="border">
            <TableBody>
              {salaries.map((salary) => {
                const ars = filters.simulate ? salary.ars.current : salary.ars.original;
                const usd = salary.usd.original;

                return (
                  <TableRow key={salary.id} className="h-14">
                    <TableCell className="min-w-64">{salary.seniority}</TableCell>
                    <TableCell className="w-32 text-left font-medium">
                      {ars ? formatSalary(ars, "ARS") : ""}
                    </TableCell>
                    <TableCell className="w-32 text-left font-medium">
                      {usd ? formatSalary(usd, "USD") : ""}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </section>
  );
}

function HomePageClientContainer({
  categories,
  salaries,
}: {
  categories: Category[];
  salaries: Record<Salary["position"], Salary[]>;
}) {
  const [filters] = useFilters();

  const filteredSalaries = filterMeanSalaries(salaries, categories, filters);

  return <HomePageClient salaries={filteredSalaries} />;
}

export default dynamic(async () => HomePageClientContainer, {
  ssr: false,
  loading: HomePageLoading,
});
