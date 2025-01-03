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
