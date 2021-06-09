import {Currency} from "../salary/types";

export function parseCurrency(value: number, currency: Currency = Currency.Ars): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
  }).format(value);
}
