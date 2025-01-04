export interface Filters {
  position: string;
  currency: string;
  seniority: string;
  sort: "position" | "seniority" | "currency" | "value" | "count";
  simulate: boolean;
  trusted: boolean;
  conversion: boolean;
  direction: "asc" | "desc";
}
