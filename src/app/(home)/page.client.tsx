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
import {MultiSelect, MultiSelectOption} from "@/components/ui/multiSelect";

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
  const [formData, setFormData] = useReducer(
    (
      state: {
        currencyFilter: Array<string>;
        seniorityFilter: Array<string>;
        positionFilter: Array<string>;
        simulate: boolean;
      },
      newState: Partial<{
        currencyFilter: Array<string>;
        seniorityFilter: Array<string>;
        positionFilter: Array<string>;
        simulate: boolean;
      }>,
    ) => ({...state, ...newState}),
    {
      currencyFilter: [],
      seniorityFilter: [],
      positionFilter: [],
      simulate: false,
    },
  );
  const matches = useMemo(
    () =>
      salaries.filter(
        ({currency, seniority, title}) =>
          (!Boolean(formData.currencyFilter.length) || formData.currencyFilter.includes(currency)) &&
          (!Boolean(formData.seniorityFilter.length) || formData.seniorityFilter.includes(seniority)) &&
          (!Boolean(formData.positionFilter.length) || formData.positionFilter.includes(title)),
      ),
    [formData, salaries],
  );

  return (
    <section className="grid gap-4">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MultiSelect title="Posiciones">
            {positions.map((position) => (
              <MultiSelectOption
                key={position}
                checked={formData.positionFilter.includes(position)}
                onCheckedChange={() => {
                  if (!formData.positionFilter.includes(position)) {
                    setFormData({positionFilter: [...formData.positionFilter, position]})
                  } else {
                    setFormData({positionFilter: formData.positionFilter.filter(pos => pos !== position)})
                  }
                }}
              >
                {position}
              </MultiSelectOption>
            ))}
          </MultiSelect>
          <MultiSelect title="Moneda">
            {currencies.map((currency) => (
              <MultiSelectOption
                key={currency}
                checked={formData.currencyFilter.includes(currency)}
                onCheckedChange={() => {
                  if (!formData.currencyFilter.includes(currency)) {
                    setFormData({currencyFilter: [...formData.currencyFilter, currency]})
                  } else {
                    setFormData({currencyFilter: formData.currencyFilter.filter(curr => curr !== currency)})
                  }
                }}
              >
                {currency}
              </MultiSelectOption>
            ))}
          </MultiSelect>
          <MultiSelect title="Seniority">
             {seniorities.map((seniority) => (
              <MultiSelectOption
                key={seniority}
                checked={formData.seniorityFilter.includes(seniority)}
                onCheckedChange={() => {
                  if (!formData.seniorityFilter.includes(seniority)) {
                    setFormData({seniorityFilter: [...formData.seniorityFilter, seniority]})
                  } else {
                    setFormData({seniorityFilter: formData.seniorityFilter.filter(sen => sen !== seniority)})
                  }
                }}
              >
                {seniority}
              </MultiSelectOption>
            ))}
          </MultiSelect>
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
              checked={formData.simulate}
              id="simulate"
              onCheckedChange={(checked) => setFormData({simulate: Boolean(checked)})}
            />
          </Label>
        )}
      </nav>
      <Table className="border">
        <TableCaption>
          Siempre tomá los valores como referencia y no como un absoluto. Un total de{" "}
          {salaries.reduce((count, salary) => count + salary.count, 0)} salarios reportados.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Posición</TableHead>
            <TableHead>Moneda</TableHead>
            <TableHead>Seniority</TableHead>
            <TableHead>Salario</TableHead>
            <TableHead className="w-[110px] text-right">Reportes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="scroll-y-auto max-h-[80vh]">
          {matches.map(({count, currency, seniority, title, value}) => (
            <TableRow key={`${title}-${currency}-${seniority}`}>
              <TableCell className="font-medium">{title}</TableCell>
              <TableCell>{currency}</TableCell>
              <TableCell>{seniority}</TableCell>
              <TableCell>
                {(formData.simulate && currency === "ARS"
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
