export interface RawSalary {
  position: string;
  seniority: string;
  currency: "USD" | "ARS";
  value: number;
}

export interface Salary extends Omit<RawSalary, "value"> {
  arsOriginalValue: number;
  usdOriginalValue: number;
  arsSimulatedValue: number;
}

export interface MeanSalary extends Salary {
  id: string;
  count: number;
}

export interface Filters {
  position: string;
  currency: string;
  seniority: string;
  sort: "position" | "seniority" | "currency" | "value" | "count";
  simulate: boolean;
  trusted: boolean;
  direction: "asc" | "desc";
}

export interface DollarPrice {
  actual: number;
  old: number;
}
