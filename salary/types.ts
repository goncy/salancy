export enum Seniority {
  Trainee = "Trainee (hasta 1 año)",
  Junior = "Junior (1 a 3 años)",
  SemiSenior = "Semi Senior (3 a 5 años)",
  Senior = "Senior (+5 años)",
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
