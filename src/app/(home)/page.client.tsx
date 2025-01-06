"use client";

import dynamic from "next/dynamic";

import type {Filters} from "@/filter/types";
import type {MeanSalary} from "@/salary/types";
import {cn} from "@/lib/utils";
import {filterMeanSalaries, formatCurrency, sortMeanSalaries} from "@/salary/utils";
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
        <div className="w-full overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className={cn(
                    {underline: filters.sort === "position"},
                    "min-w-48 cursor-pointer",
                  )}
                  onClick={() => handleSort("position")}
                >
                  Posición{" "}
                  {filters.sort === "position" &&
                    (filters.direction === "desc" ? (
                      <span className="inline-block h-4 w-4">↓</span>
                    ) : (
                      <span className="inline-block h-4 w-4">↑</span>
                    ))}
                </TableHead>
                <TableHead
                  className={cn(
                    {underline: filters.sort === "seniority"},
                    "min-w-56 cursor-pointer",
                  )}
                  onClick={() => handleSort("seniority")}
                >
                  Seniority{" "}
                  {filters.sort === "seniority" &&
                    (filters.direction === "desc" ? (
                      <span className="inline-block h-4 w-4">↓</span>
                    ) : (
                      <span className="inline-block h-4 w-4">↑</span>
                    ))}
                </TableHead>
                <TableHead
                  className={cn({underline: filters.sort === "value"}, "cursor-pointer")}
                  onClick={() => handleSort("value")}
                >
                  Salario{" "}
                  {filters.sort === "value" &&
                    (filters.direction === "desc" ? (
                      <span className="inline-block h-4 w-4">↓</span>
                    ) : (
                      <span className="inline-block h-4 w-4">↑</span>
                    ))}
                </TableHead>
                <TableHead
                  className={cn(
                    {underline: filters.sort === "count"},
                    "w-[110px] cursor-pointer text-right",
                  )}
                  onClick={() => handleSort("count")}
                >
                  Reportes{" "}
                  {filters.sort === "count" &&
                    (filters.direction === "desc" ? (
                      <span className="inline-block h-4 w-4">↓</span>
                    ) : (
                      <span className="inline-block h-4 w-4">↑</span>
                    ))}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="scroll-y-auto max-h-[80vh]">
              {salaries.map(
                ({
                  id,
                  count,
                  seniority,
                  position,
                  currency,
                  arsSimulatedValue,
                  arsOriginalValue,
                  usdOriginalValue,
                }) => {
                  const ars = formatCurrency(
                    filters.simulate ? arsSimulatedValue : arsOriginalValue,
                    "ARS",
                  );
                  const usd = formatCurrency(usdOriginalValue, "USD");

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
                        {filters.conversion ? (
                          <>
                            <span className={cn({"text-muted-foreground": currency === "ARS"})}>
                              {ars}
                            </span>
                            <span className={cn({"text-muted-foreground": currency === "USD"})}>
                              {usd}
                            </span>
                          </>
                        ) : (
                          <span>{currency === "ARS" ? ars : usd}</span>
                        )}
                      </TableCell>
                      <TableCell className="flex w-[110px] items-center justify-end gap-1.5 text-right">
                        <span>{count}</span>
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
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
