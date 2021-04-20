import { DataUtils } from "../DataUtils/DataUtils";
import { startOfDay, addDays, subDays, isSameDay, isBefore } from "date-fns";
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
    const serializedDates = dates.map(DateUtils.serializeDate);
    const keys = DataUtils.unique(serializedDates);

    /**
     * Get items by dates for all possible dates
     */
    let result: { date: Date; items: T[] }[] = [];
    keys.forEach((serial) => {
      const date = DateUtils.deserializeDate(serial);
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
    const _a = DateUtils.serializeDate(a);
    const _b = DateUtils.serializeDate(b);

    if (op) {
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
    } else {
      return _a - _b;
    }
  }

  /**
   * Serializer options
   */
  static DateSerializer = {
    yearFactor: 10000,
    monthFactor: 100,
    dateFactor: 1,
  };

  /**
   * Deserializes a date serialized with the `DateUtils.serializeDate`
   * function to the original date.
   *
   * @param serial Serialized number
   */
  static deserializeDate(serial: number) {
    let remainder = serial;
    const year = Math.floor(remainder / DateUtils.DateSerializer.yearFactor);
    remainder = remainder % DateUtils.DateSerializer.yearFactor;
    const month = Math.floor(remainder / DateUtils.DateSerializer.monthFactor);
    remainder = remainder % DateUtils.DateSerializer.monthFactor;
    const date = Math.floor(remainder / DateUtils.DateSerializer.dateFactor);
    remainder = remainder % DateUtils.DateSerializer.dateFactor;

    const yyyy = year.toString().padStart(4, "0");
    const mm = month.toString().padStart(2, "0");
    const dd = date.toString().padStart(2, "0");

    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  /**
   * Serialize a date to a number, where each date (year,month,date)
   * is mapped to a different number.
   *
   * @param date Date to serialize
   */
  static serializeDate(date: Date) {
    return (
      date.getFullYear() * DateUtils.DateSerializer.yearFactor +
      (date.getMonth() + 1) * DateUtils.DateSerializer.monthFactor +
      date.getDate() * DateUtils.DateSerializer.dateFactor
    );
  }

  /**
   * Serializes a month to a number
   *
   * @param date
   */
  static serializeMonth(date: Date): number {
    return date.getFullYear() * 12 + date.getMonth();
  }

  /**
   * Deserializes a number to a month
   *
   * @param date
   */
  static deserializeMonth(serial: number) {
    const year = Math.floor(serial / 12);
    const month = Math.floor(serial % 12);
    return new Date(year, month);
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
  static mapEachDate<T>(from: Date, to: Date, callback: (date: Date) => T) {
    const result: T[] = [];
    DateUtils.forEachDate(from, to, (date) => result.push(callback(date)));
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
  static forEachDate(from: Date, to: Date, callback: (date: Date) => void) {
    // If same day, run callback once
    if (isSameDay(from, to)) {
      callback(startOfDay(from));
      return;
    }

    // Get smaller and larger date
    const [earlier, later] = isBefore(from, to) ? [from, to] : [to, from];

    // Define direction by using either the addDays or subDays function
    // to move backwards or forwards.
    const nextDay = DateUtils.compareDate(from, "<", to)
      ? (date: Date) => startOfDay(addDays(date, 1))
      : (date: Date) => startOfDay(subDays(date, 1));

    // Check whether the current date is still within range
    const isDateInRange = (date: Date) => {
      return (
        DateUtils.compareDate(earlier, "<=", date) &&
        DateUtils.compareDate(date, "<=", later)
      );
    };

    // Loop and run callback for each date
    let date = startOfDay(from);
    while (isDateInRange(date)) {
      callback(date);
      date = nextDay(date);
    }
  }
}
