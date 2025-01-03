"use client";

import type {Salary} from "@/types";
import {Label} from "@/components/ui/label";
import {useFilters} from "@/hooks/use-filters";

export default function Filters({
  positions,
  currencies,
  seniorities,
}: {
  positions: Salary["position"][];
  currencies: Salary["currency"][];
  seniorities: Salary["seniority"][];
}) {
  const [filters, setFilter] = useFilters();

  return (
    <div className="flex flex-col gap-6">
      <Label className="flex flex-col gap-1">
        <span>Posición</span>
        <select
          aria-label="Seleccionar las posiciones"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          defaultValue={filters.position}
          onChange={(e) => setFilter("position", e.target.value)}
        >
          <option value="">Todas las posiciones</option>
          {positions.map((position) => (
            <option key={position}>{position}</option>
          ))}
        </select>
      </Label>

      <Label className="flex flex-col gap-1">
        <span>Moneda</span>
        <select
          aria-label="Seleccionar las monedas"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          defaultValue={filters.currency}
          onChange={(e) => setFilter("currency", e.target.value)}
        >
          <option value="">Todas las monedas</option>
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
      </Label>

      <Label className="flex flex-col gap-1">
        <span>Seniority</span>
        <select
          aria-label="Seleccionar los seniorities"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          defaultValue={filters.seniority}
          onChange={(e) => setFilter("seniority", e.target.value)}
        >
          <option value="">Todos los seniorities</option>
          {seniorities.map((seniority) => (
            <option key={seniority}>{seniority}</option>
          ))}
        </select>
      </Label>
    </div>
  );
}
