"use client";

import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {useFilters} from "@/filter/hooks/use-filters";

export default function Settings({inflation}: {inflation: number}) {
  const [filters, setFilter] = useFilters();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label className="flex w-full items-center gap-2" htmlFor="conversion">
          <Checkbox
            aria-label="Mostrar salarios convertido a moneda secundaria"
            defaultChecked={filters.conversion}
            id="conversion"
            onCheckedChange={(checked) => setFilter("conversion", checked ? "true" : "")}
          />
          Mostrar en moneda secundaria
        </Label>
        <small className="leading-tight text-muted-foreground">
          Se mostrará un segundo valor del salario convertido a la moneda secundaria.
        </small>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="flex w-full items-center gap-2" htmlFor="simulate">
          <Checkbox
            aria-label="Simular salarios actualizados"
            defaultChecked={filters.simulate}
            id="simulate"
            onCheckedChange={(checked) => setFilter("simulate", checked ? "true" : "")}
          />
          Simular salarios actualizados
        </Label>
        <small className="leading-tight text-muted-foreground">
          Simulamos los valores usando la inflación desde cuando la gente subió su salario (
          {inflation}%).
        </small>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="flex w-full items-center gap-2" htmlFor="trusted">
          <Checkbox
            aria-label="Ocultar salarios con pocos reportes"
            defaultChecked={filters.trusted}
            id="trusted"
            onCheckedChange={(checked) => setFilter("trusted", checked ? "true" : "")}
          />
          Ocultar salarios con pocos reportes
        </Label>
        <small className="leading-tight text-muted-foreground">
          Se ocultarán los salarios con menos de 3 reportes.
        </small>
      </div>
    </div>
  );
}
