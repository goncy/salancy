"use client";

import type {Salary} from "@/salary/types";
import {Label} from "@/components/ui/label";
import {useFilters} from "@/filter/hooks/use-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select
          aria-label="Seleccionar las posiciones"
          defaultValue={filters.position}
          onValueChange={(value) => setFilter("position", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las posiciones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las posiciones</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      <Label className="flex flex-col gap-1">
        <span>Moneda</span>
        <Select
          aria-label="Seleccionar las monedas"
          defaultValue={filters.currency}
          onValueChange={(value) => setFilter("currency", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las monedas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las monedas</SelectItem>
            {currencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      <Label className="flex flex-col gap-1">
        <span>Seniority</span>
        <Select
          aria-label="Seleccionar los seniorities"
          defaultValue={filters.seniority}
          onValueChange={(value) => setFilter("seniority", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los seniorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los seniorities</SelectItem>
            {seniorities.map((seniority) => (
              <SelectItem key={seniority} value={seniority}>
                {seniority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
}
