"use client";

import type {Category} from "@/salary/types";
import {Label} from "@/components/ui/label";
import {useFilters} from "@/filter/hooks/use-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

export default function SalariesFilters({categories}: {categories: Category[]}) {
  const [filters, setFilter] = useFilters();

  return (
    <div className="flex flex-col gap-6">
      <Label className="flex flex-col gap-2">
        <span>Categoría</span>
        <Select
          aria-label="Seleccionar la categoría"
          defaultValue={filters.category}
          onValueChange={(value) => setFilter("category", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

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
          Oculta los salarios con menos de 2 reportes.
        </small>
      </div>
    </div>
  );
}
