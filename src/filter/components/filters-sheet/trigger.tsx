"use client";

import {Filter} from "lucide-react";
import {useMemo} from "react";
import dynamic from "next/dynamic";

import {Button} from "@/components/ui/button";
import {SheetTrigger} from "@/components/ui/sheet";
import {Skeleton} from "@/components/ui/skeleton";

import {useFilters} from "../../hooks/use-filters";
import {Filters} from "../../types";

function FilterSheetTriggerContainer() {
  const [filters] = useFilters();
  const hasFilters = useMemo(
    () =>
      ["currency", "position", "seniority"].some((key) => Boolean(filters[key as keyof Filters])),
    [filters],
  );

  return (
    <SheetTrigger asChild>
      <Button className="relative" size="icon" variant="outline">
        <Filter className="h-4 w-4" />
        {Boolean(hasFilters) && (
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-secondary bg-primary" />
        )}
      </Button>
    </SheetTrigger>
  );
}

function FilterSheetTriggerSkeleton() {
  return <Skeleton className="h-10 w-10 animate-pulse rounded-md bg-muted" />;
}

export const FilterSheetTrigger = dynamic(async () => FilterSheetTriggerContainer, {
  loading: FilterSheetTriggerSkeleton,
  ssr: false,
});
