"use client";

import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {useFilters} from "@/filter/hooks/use-filters";

export default function Settings({inflation}: {inflation: number}) {
  const [filters, setFilter] = useFilters();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label className="flex w-full items-center gap-2" htmlFor="original">
          <Checkbox
            aria-label="Mostrar salarios originales"
            defaultChecked={filters.original}
            id="original"
            onCheckedChange={(checked) => setFilter("original", checked ? "true" : "")}
          />
          Mostrar salarios originales
        </Label>
        <small className="leading-tight text-muted-foreground">
          Mostrar los valores originales sin aplicar el {inflation}% de inflación desde cuando la
          gente subió su salario.
        </small>
      </div>
    </div>
  );
}
