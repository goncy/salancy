"use client";

import dynamic from "next/dynamic";
import {useMemo} from "react";

import type {Category, Salary} from "@/salary/types";
import type {Filters} from "@/filter/types";
import {filterSalaries, formatSalary, groupSalariesByPosition} from "@/salary/utils";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table";
import {useFilters} from "@/filter/hooks/use-filters";

import HomePageLoading from "./loading";

function HomePageClient({
  salaries,
  filters,
}: {
  salaries: Record<Salary["position"], Salary[]>;
  filters: Filters;
}) {
  return (
    <section className="grid h-full grid-cols-[repeat(auto-fill,minmax(480px,1fr))] content-start gap-8 overflow-auto">
      {Object.entries(salaries).map(([position, salaries]) => (
        <div key={position} className="flex flex-col gap-2">
          <p className="text-lg font-medium">{position}</p>
          <Table className="border">
            <TableBody>
              {salaries.map((salary) => {
                const arsSalary = filters.simulate ? salary.ars.current : salary.ars.original;
                const usdSalary = salary.usd.original;

                return (
                  <TableRow key={salary.id} className="h-14">
                    <TableCell className="min-w-64">{salary.seniority}</TableCell>
                    <TableCell className="w-32 text-left font-medium">
                      {Boolean(arsSalary) && (
                        <span className="flex items-center gap-2">
                          {formatSalary(arsSalary, "ARS")}
                          {Boolean(filters.count) && (
                            <small className="text-muted-foreground">({salary.ars.count})</small>
                          )}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="w-32 text-left font-medium">
                      {Boolean(usdSalary) && (
                        <span className="flex items-center gap-2">
                          {formatSalary(usdSalary, "USD")}
                          {Boolean(filters.count) && (
                            <small className="text-muted-foreground">({salary.usd.count})</small>
                          )}
                        </span>
                      )}
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
  salaries: Salary[];
}) {
  // Get query param filters
  const [filters] = useFilters();

  // Filter salaries
  const filteredSalaries = useMemo(
    () => filterSalaries(salaries, categories, filters),
    [salaries, categories, filters],
  );

  // Group salaries by position
  const groupedSalaries = useMemo(
    () => groupSalariesByPosition(filteredSalaries),
    [filteredSalaries],
  );

  // Show a placeholder if there are no salaries
  if (filteredSalaries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No se encontraron resultados
      </div>
    );
  }

  // Render the salaries
  return <HomePageClient filters={filters} salaries={groupedSalaries} />;
}

// We want to load this component only on the client side and show a skeleton while loading
export default dynamic(async () => HomePageClientContainer, {
  ssr: false,
  loading: HomePageLoading,
});
