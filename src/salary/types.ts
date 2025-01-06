export interface RawSalary {
  position: string;
  seniority: string;
  currency: "USD" | "ARS";
  value: number;
}

export interface Salary extends Omit<RawSalary, "value"> {
  id: string;
  ars: {
    original: number;
    current: number;
    count: number;
  };
  usd: {
    original: number;
    current: number;
    count: number;
  };
}

export interface Category {
  name: string;
  positions: string[];
}
