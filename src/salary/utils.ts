import type {Category, RawSalary, Salary} from "./types";

import type {Filters} from "@/filter/types";

export function calculateMeanSalaries(
  salaries: RawSalary[],
  inflation: number,
): Record<Salary["position"], Salary[]> {
  // Prepare map to group salaries by title-currency-seniority
  const table = new Map<string, Salary>();

  salaries.forEach((salary) => {
    // Create an identifier key
    const id = `${salary.position}-${salary.seniority}`;

    // If key is not on the table, create it
    if (!table.has(id)) {
      table.set(id, {
        id,
        position: salary.position,
        seniority: salary.seniority,
        currency: salary.currency,
        ars: {
          original: 0,
          current: 0,
          count: 0,
        },
        usd: {
          original: 0,
          current: 0,
          count: 0,
        },
      });
    }

    // Get the item
    const item = table.get(id)!;

    // Update the values
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

  // Calculate mean values
  const meanSalaries = Array.from(table.values())
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
    // Sort by seniority
    .toSorted((a, b) => a.seniority.localeCompare(b.seniority));

  // Group salaries by position
  const groups = meanSalaries.reduce(
    (groups, salary) => {
      groups[salary.position] = [...(groups[salary.position] ?? []), salary];

      return groups;
    },
    {} as Record<Salary["position"], Salary[]>,
  );

  // Sort by position
  return Object.fromEntries(Object.entries(groups).toSorted((a, b) => a[0].localeCompare(b[0])));
}

export function filterMeanSalaries(
  salaries: Record<Salary["position"], Salary[]>,
  categories: Category[],
  filters: Filters,
): Record<Salary["position"], Salary[]> {
  return Object.fromEntries(
    Object.entries(salaries).filter(([position]) => {
      // Filter by category
      if (filters.category) {
        const category = categories.find((category) => category.name === filters.category);

        if (!category || !category.positions.includes(position)) {
          return false;
        }
      }

      return true;
    }),
  );
}

export function formatSalary(value: number, currency: string): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    currencyDisplay: "code",
  });
}
