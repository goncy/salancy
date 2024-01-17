"use client";

import type {Salary} from "@/types";

import {useMemo, useReducer} from "react";
import {HelpCircle} from "lucide-react";

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

export default function HomePageClient({
  salaries,
  currencies,
  seniorities,
  positions,
  dollarPrice,
}: {
  salaries: Salary[];
  currencies: string[];
  seniorities: string[];
  positions: string[];
  dollarPrice: number;
}) {
  const originalDollarPrice = Number(process.env.NEXT_PUBLIC_ORIGINAL_DOLLAR_PRICE);
  const [filters, setFilters] = useReducer(
    (
      state: {
        currency: string;
        seniority: string;
        position: string;
        simulate: boolean;
        order: keyof Salary;
        ascending: boolean;
      },
      newState: Partial<{
        currency: string;
        seniority: string;
        position: string;
        simulate: boolean;
        order: keyof Salary;
        ascending: boolean;
      }>,
    ) => ({...state, ...newState}),
    {
      currency: "",
      seniority: "",
      position: "",
      simulate: false,
      order: "title",
      ascending: true,
    },
  );
  const matches = useMemo(
    () =>
      [...salaries]
        .filter(
          ({currency, seniority, title}) =>
            (!filters.currency || currency === filters.currency) &&
            (!filters.seniority || seniority === filters.seniority) &&
            (!filters.position || title === filters.position),
        )
        .sort((a, b) => {
          // Filter by currency
          if (filters.order === "value") {
            const valueA =
              a.currency === "USD"
                ? a.value * dollarPrice
                : filters.simulate
                  ? a.value * (dollarPrice / originalDollarPrice)
                  : a.value;
            const valueB =
              b.currency === "USD"
                ? b.value * dollarPrice
                : filters.simulate
                  ? b.value * (dollarPrice / originalDollarPrice)
                  : b.value;

            return filters.ascending ? valueA - valueB : valueB - valueA;
          }

          // Filter by count
          if (filters.order === "count") {
            return filters.ascending ? a.count - b.count : b.count - a.count;
          }

          // Filter by the rest
          return filters.ascending
            ? String(a[filters.order]).localeCompare(String(b[filters.order]))
            : String(b[filters.order]).localeCompare(String(a[filters.order]));
        }),
    [filters, salaries, dollarPrice, originalDollarPrice],
  );

  function handleOrderChange(order: keyof Salary) {
    if (order === filters.order) {
      setFilters({ascending: !filters.ascending});
    } else {
      setFilters({order});
    }
  }

  return (
    <section className="grid gap-4">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            value={filters.position}
            onChange={(e) => setFilters({position: e.target.value})}
          >
            <option value="">Todas las posiciones</option>
            {positions.map((position) => (
              <option key={position}>{position}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            value={filters.currency}
            onChange={(e) => setFilters({currency: e.target.value})}
          >
            <option value="">Todas las monedas</option>
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            value={filters.seniority}
            onChange={(e) => setFilters({seniority: e.target.value})}
          >
            <option value="">Todos los seniorities</option>
            {seniorities.map((seniority) => (
              <option key={seniority}>{seniority}</option>
            ))}
          </select>
        </div>
        {originalDollarPrice !== dollarPrice && (
          <Label className="flex items-center gap-2" htmlFor="simulate">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 opacity-50" />
                </TooltipTrigger>
                <TooltipContent className="max-w-64" side="left">
                  Simulamos los valores tomando el valor original cuando la gente subió su salario (
                  {originalDollarPrice.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                  ) y el valor actual (
                  {dollarPrice.toLocaleString("es-AR", {style: "currency", currency: "ARS"})}).
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Simular salarios actualizados
            <Checkbox
              checked={filters.simulate}
              id="simulate"
              onCheckedChange={(checked) => setFilters({simulate: Boolean(checked)})}
            />
          </Label>
        )}
      </nav>
      <Table className="border">
        <TableCaption>
          Siempre tomá los valores como referencia y no como un absoluto. Un total de{" "}
          {salaries.reduce((count, salary) => count + salary.count, 0)} salarios reportados. Agregá
          el tuyo{" "}
          <a
            className="underline"
            href="https://forms.gle/e11Kce3JBoDBfHWi7"
            rel="noopener"
            target="_blank"
          >
            acá
          </a>
          .
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn({underline: filters.order === "title"}, "cursor-pointer")}
              onClick={() => handleOrderChange("title")}
            >
              Posición
            </TableHead>
            <TableHead
              className={cn({underline: filters.order === "currency"}, "cursor-pointer")}
              onClick={() => handleOrderChange("currency")}
            >
              Moneda
            </TableHead>
            <TableHead
              className={cn({underline: filters.order === "seniority"}, "cursor-pointer")}
              onClick={() => handleOrderChange("seniority")}
            >
              Seniority
            </TableHead>
            <TableHead
              className={cn({underline: filters.order === "value"}, "cursor-pointer")}
              onClick={() => handleOrderChange("value")}
            >
              Salario
            </TableHead>
            <TableHead
              className={cn(
                {underline: filters.order === "count"},
                "w-[110px] cursor-pointer text-right",
              )}
              onClick={() => handleOrderChange("count")}
            >
              Reportes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="scroll-y-auto max-h-[80vh]">
          {matches.map(({count, currency, seniority, title, value}) => (
            <TableRow key={`${title}-${currency}-${seniority}`}>
              <TableCell className="font-medium">{title}</TableCell>
              <TableCell>{currency}</TableCell>
              <TableCell>{seniority}</TableCell>
              <TableCell>
                {(filters.simulate && currency === "ARS"
                  ? value * (dollarPrice / originalDollarPrice)
                  : value
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                })}
              </TableCell>
              <TableCell className="w-[110px] text-right">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
