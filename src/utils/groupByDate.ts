import * as datefns from "date-fns";

export function groupByDate<T>(
  items: T[],
  getDate: (t: T) => Date,
  options?: { sort?: boolean }
): { date: Date; items: T[] }[] {
  // Function to extract a key from an item which has a date
  function getKey(item: T): string {
    const date = getDate(item);
    return datefns.lightFormat(date, "yyyy-MM-dd");
  }

  // Get all items by their keys
  const itemsByKey = items.reduce((res, item) => {
    const key = getKey(item);
    return {
      ...res,
      [key]: [...(res[key] ?? []), item],
    };
  }, {} as Record<string, T[]>);

  // Map to array, where each key is mapped to a date
  const result = Object.entries(itemsByKey).map((entry) => {
    return {
      date: datefns.startOfDay(new Date(entry[0])),
      items: entry[1],
    };
  });

  // Return result, optionally sorted
  if (options?.sort) {
    return result.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
  } else {
    return result;
  }
}
