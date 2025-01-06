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
    </div>
  );
}
