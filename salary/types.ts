export enum Seniority {
  Trainee = "trainee",
  Junior = "junior",
  SemiSenior = "semi-senior",
  Senior = "senior",
}

export enum Currency {
  Usd = "USD",
  Ars = "ARS",
}

export interface Salary {
  position: string;
  value: number;
  currency: Currency;
  seniority: Seniority;
  count: number;
}
