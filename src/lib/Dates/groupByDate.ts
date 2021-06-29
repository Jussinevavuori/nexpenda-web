import { unique } from "../Utilities/unique";
import { compareDate } from "./compareDate";
import { DateSerializer } from "./DateSerializer";

type SortFn<T> = (a: T, b: T) => number;
type DateGroup<T> = { date: Date; items: T[] };

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
  options?: {
    sort?: boolean | "reverse" | SortFn<DateGroup<T>>;
    sortGroups?: boolean | "reverse" | SortFn<T>;
  }
): DateGroup<T>[] {
  /**
   * Get all possible dates
   */
  const dates = items.map(getDate);
  const serializedDates = dates.map(DateSerializer.serializeDate);
  const keys = unique(serializedDates);

  /**
   * Get items by dates for all possible dates
   */
  let result: DateGroup<T>[] = [];
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
  if (options?.sort) {
    const sort = options.sort;
    const sortFn =
      typeof sort === "function"
        ? sort
        : (a: DateGroup<T>, b: DateGroup<T>) => {
            const dir = sort === "reverse" ? -1 : 1;
            return dir * (b.date.getTime() - a.date.getTime());
          };

    result = result.sort(sortFn);
  }

  /**
   * Optionally sort groups
   */
  if (options?.sortGroups) {
    const sortGroups = options.sortGroups;

    // Create sort function or use provided one
    const sortFn =
      typeof sortGroups === "function"
        ? sortGroups
        : (a: T, b: T) => {
            const dir = sortGroups === "reverse" ? -1 : 1;
            return dir * (getDate(b).getTime() - getDate(a).getTime());
          };

    // Sort
    result.forEach((group) => (group.items = group.items.sort(sortFn)));
  }

  return result;
}
