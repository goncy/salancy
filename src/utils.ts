import type {MeanSalary, Salary} from "./types";

export function getMeanSalaries(
  salaries: Salary[],
  filters: {
    position: string;
    currency: string;
    seniority: string;
    sort: keyof MeanSalary;
    direction: "asc" | "desc";
    simulate: boolean;
  },
  dollarPrice: {
    actual: number;
    old: number;
  },
): MeanSalary[] {
  // Prepare map to group salaries by title-currency-seniority
  const table = new Map<string, MeanSalary>();

  salaries.forEach((salary) => {
    // Omit the elements not matching with the filters
    if (
      (filters.currency && salary.currency !== filters.currency) ||
      (filters.seniority && salary.seniority !== filters.seniority) ||
      (filters.position && salary.position !== filters.position)
    ) {
      return;
    }

    // If simulating, convert to current USD price
    if (filters.simulate) {
      salary.value = salary.value * (dollarPrice.actual / dollarPrice.old);
    }

    // Create an identifier key
    const key = `${salary.position}-${salary.currency}-${salary.seniority}`;

    // If key is not on the table, create it
    if (!table.has(key)) {
      table.set(key, {
        ...salary,
        key,
        value: 0,
        count: 0,
      });
    }

    // Get the item
    const item = table.get(key)!;

    // Push it to the table
    item.value += salary.value;
    item.count++;
  });

  // Create salary list with mean values
  const meanSalaries = Array.from(table.values()).map((salary) => ({
    ...salary,
    value: salary.value / salary.count,
  }));

  // Sort and return salaries
  return meanSalaries.sort((a, b) => {
    // Filter by currency
    if (filters.sort === "value") {
      const valueA = a.currency === "USD" ? a.value * dollarPrice.actual : a.value;
      const valueB = b.currency === "USD" ? b.value * dollarPrice.actual : b.value;

      return filters.direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Filter by count
    if (filters.sort === "count") {
      return filters.direction === "asc" ? a.count - b.count : b.count - a.count;
    }

    // Filter by the rest
    return filters.direction === "asc"
      ? String(a[filters.sort]).localeCompare(String(b[filters.sort]))
      : String(b[filters.sort]).localeCompare(String(a[filters.sort]));
  });
}
