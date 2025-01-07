import type {Category, RawSalary, Salary} from "./types";

import type {Filters} from "@/filter/types";

export function calculateMeanSalaries(salaries: RawSalary[], inflation: number): Salary[] {
  // Group salaries by position and seniority, accumulating values for each currency
  const table = new Map<string, Salary>();

  salaries.forEach((salary) => {
    const id = `${salary.position}-${salary.seniority}`;

    // Initialize new salary group if not exists
    if (!table.has(id)) {
      table.set(id, {
        id,
        position: salary.position,
        seniority: salary.seniority,
        currency: salary.currency,
        ars: {original: 0, current: 0, count: 0},
        usd: {original: 0, current: 0, count: 0},
      });
    }

    const item = table.get(id)!;

    // Accumulate values by currency, applying inflation to ARS
    if (salary.currency === "USD") {
      item.usd.original += salary.value;
      item.usd.current += salary.value;
      item.usd.count++;
    } else {
      item.ars.original += salary.value;
      item.ars.current += salary.value * (1 + inflation / 100);
      item.ars.count++;
    }
  });

  // Calculate mean values and sort by seniority
  return Array.from(table.values())
    .map((salary) => ({
      ...salary,
      ars: {
        ...salary.ars,
        original: Math.round(salary.ars.original / salary.ars.count),
        current: Math.round(salary.ars.current / salary.ars.count),
      },
      usd: {
        ...salary.usd,
        original: Math.round(salary.usd.original / salary.usd.count),
        current: Math.round(salary.usd.current / salary.usd.count),
      },
    }))
    .toSorted((a, b) => a.seniority.localeCompare(b.seniority));
}

export function filterSalaries(
  salaries: Salary[],
  categories: Category[],
  filters: Filters,
): Salary[] {
  return salaries.reduce((result, salary) => {
    const draft = structuredClone(salary);

    // Filter by category
    if (filters.category) {
      const category = categories.find((category) => category.name === filters.category);

      if (!category || !category.positions.includes(salary.position)) {
        return result;
      }
    }

    // Filter by trusted (only show salaries with at least 2 reports)
    if (filters.trusted) {
      if (salary.ars.count < 2) {
        draft.ars.count = 0;
        draft.ars.current = 0;
        draft.ars.original = 0;
      }

      if (salary.usd.count < 2) {
        draft.usd.count = 0;
        draft.usd.current = 0;
        draft.usd.original = 0;
      }

      if (draft.ars.count === 0 && draft.usd.count === 0) {
        return result;
      }
    }

    // Return true if no filters are applied
    return result.concat(draft);
  }, [] as Salary[]);
}

export function groupSalariesByPosition(salaries: Salary[]): Record<Salary["position"], Salary[]> {
  // Group salaries by position
  const groups = salaries.reduce(
    (groups, salary) => {
      groups[salary.position] = [...(groups[salary.position] ?? []), salary];

      return groups;
    },
    {} as Record<Salary["position"], Salary[]>,
  );

  // Sort alphabetically by position
  return Object.fromEntries(Object.entries(groups).toSorted((a, b) => a[0].localeCompare(b[0])));
}

export function formatSalary(value: number, currency: string): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    currencyDisplay: "code",
  });
}
