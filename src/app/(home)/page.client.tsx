"use client";

import type {Filters, MeanSalary, Options} from "@/types";

import {HelpCircle} from "lucide-react";
import {useSearchParams} from "next/navigation";
import dynamic from "next/dynamic";

import HomePageLoading from "./loading";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {filterMeanSalaries, sortMeanSalaries} from "@/utils";

function HomePageClient({
  salaries,
  inflation,
  filters,
  options,
}: {
  salaries: MeanSalary[];
  inflation: number;
  filters: Filters;
  options: Options;
}) {
  function handleFilter(key: string, value: string) {
    // Create new search params
    const params = new URLSearchParams(window.location.search);

    // Update or remove the value changed
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // As there is no server-side stuff going on, we can just update the URL without reloading
    window.history.pushState(null, "", `?${params.toString()}`);
  }

  function handleSort(order: Filters["sort"]) {
    if (order === filters.sort) {
      handleFilter("direction", filters.direction === "asc" ? "desc" : "asc");
    } else {
      handleFilter("sort", order);
    }
  }

  return (
    <section className="grid h-full grid-rows-[auto,1fr] gap-4">
      <nav className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex w-full flex-col items-center gap-2 sm:flex-row md:gap-4">
          <select
            aria-label="Seleccionar las posiciones"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[180px] [&>span]:line-clamp-1"
            defaultValue={filters.position}
            onChange={(e) => handleFilter("position", e.target.value)}
          >
            <option value="">Todas las posiciones</option>
            {options.positions.map((position) => (
              <option key={position}>{position}</option>
            ))}
          </select>
          <select
            aria-label="Seleccionar las monedas"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[180px] [&>span]:line-clamp-1"
            defaultValue={filters.currency}
            onChange={(e) => handleFilter("currency", e.target.value)}
          >
            <option value="">Todas las monedas</option>
            {options.currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
          <select
            aria-label="Seleccionar los seniorities"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[180px] [&>span]:line-clamp-1"
            defaultValue={filters.seniority}
            onChange={(e) => handleFilter("seniority", e.target.value)}
          >
            <option value="">Todos los seniorities</option>
            {options.seniorities.map((seniority) => (
              <option key={seniority}>{seniority}</option>
            ))}
          </select>
        </div>
        {Math.abs(inflation) > 5 && (
          <Label
            className="flex w-full items-center justify-center gap-2 sm:justify-end"
            htmlFor="simulate"
          >
            <Checkbox
              aria-label="Simular salarios actualizados"
              defaultChecked={filters.simulate}
              id="simulate"
              onCheckedChange={(checked) => handleFilter("simulate", String(checked))}
            />
            Simular salarios actualizados
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle
                    aria-label="Simulamos los valores usando la inflación desde cuando la gente subió su salario ({inflation}%)."
                    className="h-4 w-4 opacity-50"
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-64" side="left">
                  Simulamos los valores usando la inflación desde cuando la gente subió su salario (
                  {inflation}%).
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
        )}
      </nav>
      {salaries.length > 0 ? (
        <div className="relative w-full overflow-auto">
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
                  className={cn({underline: filters.sort === "currency"}, "cursor-pointer")}
                  onClick={() => handleSort("currency")}
                >
                  Moneda
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
              {salaries.map(
                ({
                  id,
                  count,
                  currency,
                  seniority,
                  position,
                  arsOriginalValue,
                  arsSimulatedValue,
                  usdOriginalValue,
                }) => {
                  const value =
                    currency === "ARS"
                      ? filters.simulate
                        ? arsSimulatedValue
                        : arsOriginalValue
                      : usdOriginalValue;

                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{position}</TableCell>
                      <TableCell>{currency}</TableCell>
                      <TableCell>{seniority}</TableCell>
                      <TableCell className="font-medium">
                        {value.toLocaleString("es-AR", {
                          style: "currency",
                          currency,
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell className="flex w-[110px] items-center justify-end gap-1.5 text-right">
                        <span className={cn({"text-yellow-500": count < 3})}>{count}</span>
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

function HomePageClientContainer({
  salaries,
  options,
  inflation,
}: {
  salaries: MeanSalary[];
  options: Options;
  inflation: number;
}) {
  // Get search params from a client component to avoid busting the server cache in every request
  const searchParams = useSearchParams();

  // Get filters from params
  const filters: Filters = {
    position: searchParams.get("position") || "",
    currency: searchParams.get("currency") || "",
    seniority: searchParams.get("seniority") || "",
    sort: (searchParams.get("sort") as Filters["sort"]) || "position",
    simulate: Math.abs(inflation) > 5 ? searchParams.get("simulate") !== "false" : false,
    direction: (searchParams.get("direction") as "asc" | "desc" | null) || "asc",
  };

  // Get filtered mean salaries
  const filteredSalaries = filterMeanSalaries(salaries, filters);
  const sortedSalaries = sortMeanSalaries(filteredSalaries, filters);

  return (
    <HomePageClient
      filters={filters}
      inflation={inflation}
      options={options}
      salaries={sortedSalaries}
    />
  );
}

export default dynamic(async () => HomePageClientContainer, {
  ssr: false,
  loading: HomePageLoading,
});
