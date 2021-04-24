import { DataUtils } from "../DataUtils/DataUtils";
import { startOfDay, addDays } from "date-fns";
import { DateSerializer } from "./DateSerializer";
export type DateUtilsCompareOperator = ">" | ">=" | "==" | "<=" | "<";

export class DateUtils {
  /**
   * Groups items (where items can be associated with a Date object)
   * by their date.
   *
   * @param items All items to group
   * @param getDate Function to associate an item with its date
   * @param options Options
   */
  static groupByDate<T>(
    items: T[],
    getDate: (t: T) => Date,
    options?: { sort?: boolean | "reverse" }
  ): { date: Date; items: T[] }[] {
    /**
     * Get all possible dates
     */
    const dates = items.map(getDate);
    const serializedDates = dates.map(DateSerializer.serializeDate);
    const keys = DataUtils.unique(serializedDates);

    /**
     * Get items by dates for all possible dates
     */
    let result: { date: Date; items: T[] }[] = [];
    keys.forEach((serial) => {
      const date = DateSerializer.deserializeDate(serial);
      const itemsOnDate = items.filter((item) => {
        const itemdate = getDate(item);
        return DateUtils.compareDate(date, "==", itemdate);
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

  /**
   * Groups items by their dates into map, where the key is the date serial
   * for that date.
   *
   * @param items 	List of all items
   * @param getDate Function to extract the date from an item
   */
  static groupByDateSerialToMap<T>(
    items: T[],
    getDate: (t: T) => Date
  ): { [dateSerial: number]: T[] } {
    return items.reduce((res, item) => {
      const date = getDate(item);
      const serial = DateSerializer.serializeDate(date);

      const group = res[serial] ?? [];

      return { ...res, [serial]: [...group, item] };
    }, {} as { [dateSerial: number]: T[] });
  }

  /**
   * Utility function to compare two dates, where only the date is taken into
   * account, not the time. If an operator is given, will return a boolean value,
   * else will return a numerical value of the comparison as the difference in
   * days.
   *
   * @param a  Left hand operator date
   * @param op Operator to specify which comparison to run (optional)
   * @param b  Right hand operator date
   */
  static compareDate(a: Date, op: DateUtilsCompareOperator, b: Date): boolean;
  static compareDate(a: Date, b: Date): number;
  static compareDate(
    ...args: [Date, DateUtilsCompareOperator, Date] | [Date, Date]
  ): boolean | number {
    // Get dates and optional operator
    const [a, b] = args.length === 3 ? [args[0], args[2]] : [args[0], args[1]];
    const op = args.length === 3 ? args[1] : undefined;

    // Serialize dates for easy comparison
    const _a = DateSerializer.serializeDate(a);
    const _b = DateSerializer.serializeDate(b);

    // If no operator given, return number which has sign corresponding to the
    // difference of those dates.
    if (!op) {
      return _a - _b;
    }

    // Else return boolean corresponding to result of comparison by operator.
    switch (op) {
      case "<":
        return _a < _b;
      case "<=":
        return _a <= _b;
      case "==":
        return _a === _b;
      case ">=":
        return _a >= _b;
      case ">":
        return _a > _b;
    }
  }

  /**
   * Get date range from a list of dates
   *
   * @param dates
   * @returns
   */
  static datesToDateRange(dates: Date[]) {
    const values = dates.map((_) => _.valueOf()).filter(Boolean);

    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      min: new Date(min),
      max: new Date(max),
    };
  }

  /**
   * Maps a range of dates between `from` and `to` to values as specified by the
   * callback function which maps a date to a value. If the order of `from` and
   * `to` are swapped, the function will run the range in reverse.
   *
   * @param from			The earlier date. If this is later than the later date,
   * 									the function will run the loop in the opposite direction.
   *
   * @param to 				The later date. If this is earlier than the earlier date,
   * 									the function will run the loop in the opposite direction.
   *
   * @param callback	The callback function which is run once for each date
   * 									within the range, in order (or reverse order if date
   * 									orders are swapper.) Receives the date at the start of the
   * 									day as an argument. Maps that date to a value which is
   * 									returned in the array to the user.
   *
   * @returns 				All mapped values for each date in the interval, including
   * 									the start and end days.
   */
  static mapEachDate<T>(
    from: Date,
    to: Date,
    callback: (date: Date, i: number) => T
  ) {
    const result: T[] = [];
    DateUtils.forEachDate(from, to, (date, i) =>
      result.push(callback(date, i))
    );
    return result;
  }

  /**
   * Run a callback function for each date between the dates defining
   * the range, including those dates.
   *
   * @param from			The earlier date. If this is later than the later date,
   * 									the function will run the loop in the opposite direction.
   *
   * @param to 				The later date. If this is earlier than the earlier date,
   * 									the function will run the loop in the opposite direction.
   *
   * @param callback	The callback function which is run once for each date
   * 									within the range, in order (or reverse order if date
   * 									orders are swapper.) Receives the date at the start of the
   * 									day as an argument.
   */
  static forEachDate(
    from: Date,
    to: Date,
    callback: (date: Date, i: number) => void
  ) {
    // Get number of days to increment on each loop (1 or -1)
    const daysIncrement = DateUtils.compareDate(from, "<=", to) ? 1 : -1;

    // Get min and max dates
    const min = DateUtils.compareDate(from, "<=", to) ? from : to;
    const max = DateUtils.compareDate(from, "<=", to) ? to : from;

    // Loop and run callback for each date
    let date = from;
    let i = 0;
    while (
      DateUtils.compareDate(min, "<=", date) &&
      DateUtils.compareDate(date, "<=", max)
    ) {
      callback(date, i);
      date = startOfDay(addDays(date, daysIncrement));
      i++;
    }
  }
}
