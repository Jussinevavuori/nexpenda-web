import { unique } from "../Utilities/unique";
import { compareDate } from "./compareDate";
import { DateSerializer } from "./DateSerializer";

/**
 * Groups items (where items can be associated with a Date object)
 * by their date.
 *
 * @param items All items to group
 * @param getDate Function to associate an item with its date
 * @param options Options
 */
export function groupByDate<T>(
  items: T[],
  getDate: (t: T) => Date,
  options?: { sort?: boolean | "reverse" }
): { date: Date; items: T[] }[] {
  /**
   * Get all possible dates
   */
  const dates = items.map(getDate);
  const serializedDates = dates.map(DateSerializer.serializeDate);
  const keys = unique(serializedDates);

  /**
   * Get items by dates for all possible dates
   */
  let result: { date: Date; items: T[] }[] = [];
  keys.forEach((serial) => {
    const date = DateSerializer.deserializeDate(serial);
    const itemsOnDate = items.filter((item) => {
      const itemdate = getDate(item);
      return compareDate(date, "==", itemdate);
    });
    result.push({ date, items: itemsOnDate });
  });

  /**
   * Optionally sort
   */
  if (options?.sort === true) {
    result = result.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
  } else if (options?.sort === "reverse") {
    result = result.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  }

  return result;
}
