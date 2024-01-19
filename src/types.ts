export interface Salary {
  position: string;
  currency: "USD" | "ARS";
  value: number;
  seniority: string;
}

export interface MeanSalary extends Salary {
  key: string;
  count: number;
}

export interface Options {
  positions: Salary["position"][];
  currencies: Salary["currency"][];
  seniorities: Salary["seniority"][];
}
