export function getUniqueProperties<T>(list: T[], property: keyof T): T[keyof T][] {
  return list
    .map((item) => item[property])
    .filter((key, index, list) => Boolean(key) && list.indexOf(key) === index);
}
