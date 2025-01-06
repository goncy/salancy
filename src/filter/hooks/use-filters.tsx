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
    simulate: searchParams.get("simulate") === "true",
    category: searchParams.get("category") || "",
  };

  return [filters, setFilter];
}
