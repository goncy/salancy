"use client";

import type {Salary} from "@/types";

import {useMemo} from "react";
import {HelpCircle} from "lucide-react";
import {useSearchParams, usePathname, useRouter} from "next/navigation";

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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const originalDollarPrice = Number(process.env.NEXT_PUBLIC_ORIGINAL_DOLLAR_PRICE);

  const handleChangeValue = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const matches = useMemo(() => {
    const params = new URLSearchParams(searchParams);

    const currencyParam = params.get("currency");
    const seniorityParam = params.get("seniority");
    const positionParam = params.get("position");

    return salaries.filter(
      ({currency, seniority, title}) =>
        (!currencyParam || currency === currencyParam) &&
        (!seniorityParam || seniority === seniorityParam) &&
        (!positionParam || title === positionParam),
    );
  }, [salaries]);

  return (
    <section className="grid gap-4">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("position") ?? ""}
            onChange={(e) => handleChangeValue("position", e.target.value)}
          >
            <option value="">Todas las posiciones</option>
            {positions.map((position) => (
              <option key={position}>{position}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("currency") ?? ""}
            onChange={(e) => handleChangeValue("currency", e.target.value)}
          >
            <option value="">Todas las monedas</option>
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("seniority") ?? ""}
            onChange={(e) => handleChangeValue("seniority", e.target.value)}
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
              checked={Boolean(searchParams.get("simulate"))}
              id="simulate"
              onCheckedChange={(checked) => handleChangeValue("simulate", checked ? "1" : "")}
            />
          </Label>
        )}
      </nav>
      <Table className="border">
        <TableCaption>Siempre tomá los valores como referencia y no como un absoluto.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Posición</TableHead>
            <TableHead>Moneda</TableHead>
            <TableHead>Seniority</TableHead>
            <TableHead>Salario</TableHead>
            <TableHead className="w-[110px] text-right">Reportes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map(({count, currency, seniority, title, value}) => (
            <TableRow key={`${title}-${currency}-${seniority}`}>
              <TableCell className="font-medium">{title}</TableCell>
              <TableCell>{currency}</TableCell>
              <TableCell>{seniority}</TableCell>
              <TableCell>
                {(Boolean(searchParams.get("simulate")) && currency === "ARS"
                  ? value * (dollarPrice / originalDollarPrice)
                  : value
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency,
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
