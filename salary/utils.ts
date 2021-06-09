import {Salary} from "./types";

export function getUniqueProperties(
  list: Salary[],
  property: keyof Salary,
): Salary[keyof Salary][] {
  return list
    .map((item) => item[property])
    .filter((key, index, list) => Boolean(key) && list.indexOf(key) === index);
}
