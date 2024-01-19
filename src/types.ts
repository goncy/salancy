export interface Salary {
  position: string;
  currency: "USD" | "ARS";
  value: number;
  seniority: string;
}

export interface MeanSalary extends Salary {
  id: string;
  count: number;
}

export interface Options {
  positions: Salary["position"][];
  currencies: Salary["currency"][];
  seniorities: Salary["seniority"][];
}

export interface Filters {
  position: string;
  currency: string;
  seniority: string;
  sort: keyof MeanSalary;
  simulate: boolean;
  direction: "asc" | "desc";
}

export interface DollarPrice {
  actual: number;
  old: number;
}
