import { DataUtils } from "../DataUtils/DataUtils";
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
    options?: { sort?: boolean }
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
    if (options?.sort) {
      result = result.sort((a, b) => {
        return b.date.getTime() - a.date.getTime();
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
}
