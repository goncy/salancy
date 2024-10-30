import type {DollarPrice, Filters, MeanSalary, Options, RawSalary} from "./types";

export function calculateMeanSalaries(
  salaries: RawSalary[],
  dollarPrice: DollarPrice,
  inflation: number,
): MeanSalary[] {
  // Prepare map to group salaries by title-currency-seniority
  const table = new Map<string, MeanSalary>();

  salaries.forEach((salary) => {
    // Create an identifier key
    const id = `${salary.position}-${salary.currency}-${salary.seniority}`;

    // If key is not on the table, create it
    if (!table.has(id)) {
      table.set(id, {
        id,
        position: salary.position,
        seniority: salary.seniority,
        currency: salary.currency,
        arsOriginalValue: 0,
        usdOriginalValue: 0,
        arsSimulatedValue: 0,
        count: 0,
      });
    }

    // Get the item
    const item = table.get(id)!;

    // Update the values
    if (salary.currency === "USD") {
      item.arsOriginalValue += salary.value * dollarPrice.actual;
      item.usdOriginalValue += salary.value;
      item.arsSimulatedValue += salary.value * dollarPrice.actual * (1 + inflation / 100);
    } else {
      item.arsOriginalValue += salary.value;
      item.usdOriginalValue += salary.value / dollarPrice.actual;
      item.arsSimulatedValue += salary.value * (1 + inflation / 100);
    }

    // Update the count
    item.count++;
  });

  // Create and return salary list with mean values
  return Array.from(table.values()).map((salary) => ({
    ...salary,
    arsOriginalValue: Math.round(salary.arsOriginalValue / salary.count),
    usdOriginalValue: Math.round(salary.usdOriginalValue / salary.count),
    arsSimulatedValue: Math.round(salary.arsSimulatedValue / salary.count),
  }));
}

export function sortMeanSalaries(meanSalaries: MeanSalary[], filters: Filters): MeanSalary[] {
  return meanSalaries.toSorted((a, b) => {
    // Filter by value
    if (filters.sort === "value") {
      const valueA = filters.simulate ? a.arsSimulatedValue : a.arsOriginalValue;
      const valueB = filters.simulate ? b.arsSimulatedValue : b.arsOriginalValue;

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

export function calculateOptions(salaries: MeanSalary[]): Options {
  const positions = new Set<MeanSalary["position"]>();
  const currencies = new Set<MeanSalary["currency"]>();
  const seniorities = new Set<MeanSalary["seniority"]>();

  for (const {position, currency, seniority} of salaries) {
    positions.add(position);
    currencies.add(currency);
    seniorities.add(seniority);
  }

  return {
    positions: Array.from(positions).toSorted((a, b) => a.localeCompare(b)),
    currencies: Array.from(currencies).toSorted((a, b) => a.localeCompare(b)),
    seniorities: Array.from(seniorities).toSorted((a, b) => a.localeCompare(b)),
  };
}
