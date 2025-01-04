"use client";

import dynamic from "next/dynamic";

import type {Filters} from "@/filter/types";
import type {MeanSalary} from "@/salary/types";
import {cn} from "@/lib/utils";
import {filterMeanSalaries, getSalaryValues, sortMeanSalaries} from "@/salary/utils";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useFilters} from "@/filter/hooks/use-filters";

import HomePageLoading from "./loading";

function HomePageClient({salaries, filters}: {salaries: MeanSalary[]; filters: Filters}) {
  const [, setFilter] = useFilters();

  function handleSort(order: Filters["sort"]) {
    if (order === filters.sort) {
      setFilter("direction", filters.direction === "asc" ? "desc" : "asc");
    } else {
      setFilter("sort", order);
    }
  }

  return (
    <section className="grid h-full gap-4">
      {salaries.length > 0 ? (
        <div className="w-full overflow-auto">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead
                  className={cn(
                    {underline: filters.sort === "position"},
                    "min-w-48 cursor-pointer",
                  )}
                  onClick={() => handleSort("position")}
                >
                  Posición
                </TableHead>
                <TableHead
                  className={cn(
                    {underline: filters.sort === "seniority"},
                    "min-w-48 cursor-pointer",
                  )}
                  onClick={() => handleSort("seniority")}
                >
                  Seniority
                </TableHead>
                <TableHead
                  className={cn({underline: filters.sort === "value"}, "cursor-pointer")}
                  onClick={() => handleSort("value")}
                >
                  Salario
                </TableHead>
                <TableHead
                  className={cn(
                    {underline: filters.sort === "count"},
                    "w-[110px] cursor-pointer text-right",
                  )}
                  onClick={() => handleSort("count")}
                >
                  Reportes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="scroll-y-auto max-h-[80vh]">
              {salaries.map((salary) => {
                const {id, count, seniority, position} = salary;
                const [mainValue, secondaryValue] = getSalaryValues(salary, filters);

                return (
                  <TableRow
                    key={id}
                    className="h-14"
                    style={{
                      contentVisibility: "auto",
                      containIntrinsicSize: "0 53px",
                    }}
                  >
                    <TableCell className="font-medium">{position}</TableCell>
                    <TableCell>{seniority}</TableCell>
                    <TableCell className="space-x-2 font-medium">
                      <span>{mainValue}</span>
                      <span className="text-muted-foreground">{secondaryValue}</span>
                    </TableCell>
                    <TableCell className="flex w-[110px] items-center justify-end gap-1.5 text-right">
                      <span>{count}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>
          <p className="flex items-center justify-center text-balance border border-muted bg-muted/25 p-4 text-center text-muted-foreground md:p-8">
            No hay salarios que coincidan con los filtros
          </p>
        </div>
      )}
    </section>
  );
}

function HomePageClientContainer({salaries}: {salaries: MeanSalary[]}) {
  const [filters] = useFilters();

  // Get filtered mean salaries
  const filteredSalaries = filterMeanSalaries(salaries, filters);
  const sortedSalaries = sortMeanSalaries(filteredSalaries, filters);

  return <HomePageClient filters={filters} salaries={sortedSalaries} />;
}

export default dynamic(async () => HomePageClientContainer, {
  ssr: false,
  loading: HomePageLoading,
});
