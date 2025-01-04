import type {MeanSalary, RawSalary} from "./types";

import type {Filters} from "@/filter/types";
import type {USDPrice} from "@/index/types";

export function calculateMeanSalaries(
  salaries: RawSalary[],
  usdPrice: USDPrice,
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
      item.arsOriginalValue += salary.value * usdPrice.actual;
      item.usdOriginalValue += salary.value;
      item.arsSimulatedValue += salary.value * usdPrice.actual * (1 + inflation / 100);
    } else {
      item.arsOriginalValue += salary.value;
      item.usdOriginalValue += salary.value / usdPrice.actual;
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

export function filterMeanSalaries(salaries: MeanSalary[], filters: Filters): MeanSalary[] {
  return salaries.filter((salary) => {
    // Filter by position
    if (
      filters.position &&
      !salary.position.toLowerCase().includes(filters.position.toLowerCase())
    ) {
      return false;
    }

    // Filter by currency
    if (
      filters.currency &&
      !salary.currency.toLowerCase().includes(filters.currency.toLowerCase())
    ) {
      return false;
    }

    // Filter by seniority
    if (
      filters.seniority &&
      !salary.seniority.toLowerCase().includes(filters.seniority.toLowerCase())
    ) {
      return false;
    }

    // Filter salaries with trusted count
    if (filters.trusted && salary.count < 3) {
      return false;
    }

    return true;
  });
}

export function formatCurrency(value: number, currency: string): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    currencyDisplay: "code",
  });
}
