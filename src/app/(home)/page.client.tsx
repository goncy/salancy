"use client";

import type {DollarPrice, Filters, MeanSalary, Options, Salary} from "@/types";

import {HelpCircle} from "lucide-react";
import {useSearchParams, usePathname} from "next/navigation";
import {useRouter} from "next/navigation";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import {getMeanSalaries} from "@/utils";

function HomePageClient({
  salaries,
  inflation,
  dollarPrice,
  filters,
  options,
  total,
}: {
  salaries: MeanSalary[];
  inflation: number;
  dollarPrice: DollarPrice;
  filters: Filters;
  options: Options;
  total: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSort(order: keyof MeanSalary) {
    if (order === filters.sort) {
      handleFilter("direction", filters.direction === "asc" ? "desc" : "asc");
    } else {
      handleFilter("sort", order);
    }
  }

  return (
    <section className="grid gap-4">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("position") ?? ""}
            onChange={(e) => handleFilter("position", e.target.value)}
          >
            <option value="">Todas las posiciones</option>
            {options.positions.map((position) => (
              <option key={position}>{position}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("currency") ?? ""}
            onChange={(e) => handleFilter("currency", e.target.value)}
          >
            <option value="">Todas las monedas</option>
            {options.currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("seniority") ?? ""}
            onChange={(e) => handleFilter("seniority", e.target.value)}
          >
            <option value="">Todos los seniorities</option>
            {options.seniorities.map((seniority) => (
              <option key={seniority}>{seniority}</option>
            ))}
          </select>
        </div>
        {dollarPrice.old !== dollarPrice.actual && (
          <Label className="flex items-center gap-2" htmlFor="simulate">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 opacity-50" />
                </TooltipTrigger>
                <TooltipContent className="max-w-64" side="left">
                  Simulamos los valores usando la inflación desde cuando la gente subió su salario (
                  {inflation}%).
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Simular salarios actualizados
            <Checkbox
              defaultChecked={filters.simulate}
              id="simulate"
              onCheckedChange={(checked) => handleFilter("simulate", String(checked))}
            />
          </Label>
        )}
      </nav>
      <Table className="border">
        <TableCaption>
          Siempre tomá los valores como referencia y no como un absoluto. {total} salarios
          reportados.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn({underline: filters.sort === "position"}, "cursor-pointer")}
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
              className={cn({underline: filters.sort === "seniority"}, "cursor-pointer")}
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
          {salaries.length ? (
            salaries.map(({id, count, currency, seniority, position, value}) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{position}</TableCell>
                <TableCell>{currency}</TableCell>
                <TableCell>{seniority}</TableCell>
                <TableCell>
                  {value.toLocaleString("es-AR", {
                    style: "currency",
                    currency,
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell className="w-[110px] text-right">{count}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center text-muted-foreground" colSpan={5}>
                No hay salarios que coincidan con los filtros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}

export default function HomePageClientContainer({
  salaries,
  dollarPrice,
  options,
  inflation,
}: {
  salaries: Salary[];
  options: Options;
  dollarPrice: DollarPrice;
  inflation: number;
}) {
  // Get search params from a client component to avoid busting the server cache in every request
  const searchParams = useSearchParams();

  // Get filters from params
  const filters: Filters = {
    position: searchParams.get("position") || "",
    currency: searchParams.get("currency") || "",
    seniority: searchParams.get("seniority") || "",
    sort: (searchParams.get("sort") as null | keyof MeanSalary) || "position",
    simulate: searchParams.get("simulate") !== "false",
    direction: (searchParams.get("direction") as "asc" | "desc" | null) || "asc",
  };

  // Get filtered mean salaries
  const meanSalaries = getMeanSalaries(salaries, filters, dollarPrice, inflation);

  return (
    <HomePageClient
      dollarPrice={dollarPrice}
      filters={filters}
      inflation={inflation}
      options={options}
      salaries={meanSalaries}
      total={salaries.length}
    />
  );
}
