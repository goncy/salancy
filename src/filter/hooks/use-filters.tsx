import {useSearchParams} from "next/navigation";

import {Filters} from "../types";

function setFilter(key: string, value: string) {
  // Create new search params
  const params = new URLSearchParams(window.location.search);

  // Update or remove the value changed
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  // As there is no server-side stuff going on, we can just update the URL without reloading
  window.history.pushState(null, "", `?${params.toString()}`);
}

export function useFilters(): [Filters, typeof setFilter] {
  const searchParams = useSearchParams();

  const filters: Filters = {
    position: searchParams.get("position") || "",
    currency: searchParams.get("currency") || "",
    seniority: searchParams.get("seniority") || "",
    simulate: searchParams.get("simulate") === "true",
    trusted: searchParams.get("trusted") === "true",
    sort: (searchParams.get("sort") as Filters["sort"]) || "position",
    direction: (searchParams.get("direction") as Filters["direction"]) || "asc",
  };

  return [filters, setFilter];
}
