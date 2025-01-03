"use client";

import type {Salary} from "@/salary/types";
import {Label} from "@/components/ui/label";
import {useFilters} from "@/filter/hooks/use-filters";
import {Select} from "@/components/ui/select";

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
          onChange={(e) => setFilter("position", e.target.value)}
        >
          <option value="">Todas las posiciones</option>
          {positions.map((position) => (
            <option key={position}>{position}</option>
          ))}
        </Select>
      </Label>

      <Label className="flex flex-col gap-1">
        <span>Moneda</span>
        <Select
          aria-label="Seleccionar las monedas"
          defaultValue={filters.currency}
          onChange={(e) => setFilter("currency", e.target.value)}
        >
          <option value="">Todas las monedas</option>
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </Select>
      </Label>

      <Label className="flex flex-col gap-1">
        <span>Seniority</span>
        <Select
          aria-label="Seleccionar los seniorities"
          defaultValue={filters.seniority}
          onChange={(e) => setFilter("seniority", e.target.value)}
        >
          <option value="">Todos los seniorities</option>
          {seniorities.map((seniority) => (
            <option key={seniority}>{seniority}</option>
          ))}
        </Select>
      </Label>
    </div>
  );
}
