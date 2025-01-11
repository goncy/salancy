"use client";

import dynamic from "next/dynamic";
import {useMemo} from "react";
import Image from "next/image";

import type {Category, Salary} from "@/salary/types";
import type {Filters} from "@/filter/types";
import {filterSalaries, formatSalary, groupSalariesByPosition} from "@/salary/utils";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useFilters} from "@/filter/hooks/use-filters";
import argentineFlag from "@/core/assets/argentine-flag.svg";
import usFlag from "@/core/assets/us-flag.svg";

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
          <Table className="border">
            <TableHeader className="bg-muted">
              <TableRow className="h-14">
                <TableHead className="text-lg font-medium text-foreground">{position}</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Image alt="ARS" height={18} src={argentineFlag} width={18} />
                    ARS
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Image alt="USD" height={18} src={usFlag} width={18} />
                    USD
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salaries.map((salary) => {
                const arsSalary = filters.simulate ? salary.ars.current : salary.ars.original;
                const usdSalary = salary.usd.original;

                return (
                  <TableRow key={salary.id} className="h-14">
                    <TableCell className="w-full">{salary.seniority}</TableCell>
                    <TableCell className="min-w-32 font-medium">
                      {Boolean(salary.ars.count) && (
                        <span className="flex items-center gap-2">
                          {formatSalary(arsSalary, "ARS")}
                          <small className="text-muted-foreground">({salary.ars.count})</small>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-32 font-medium">
                      {Boolean(salary.usd.count) && (
                        <span className="flex items-center gap-2">
                          {formatSalary(usdSalary, "USD")}
                          <small className="text-muted-foreground">({salary.usd.count})</small>
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

// We want to load this component only on the client side to handle search params reading on the client, mantaining page static. We also show a skeleton while loading
export default dynamic(async () => HomePageClientContainer, {
  ssr: false,
  loading: HomePageLoading,
});
