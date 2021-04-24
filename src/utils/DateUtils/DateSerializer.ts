/**
 * Dates can be serialized to and from numbers such that each date is given a
 * unique serial number. For example 5.7.2020 is mapped to 20200705.
 *
 * These serials can be used to compare dates without accounting for timestamps
 * but they should NOT be used for arithmetic. For example, `serial + 1` may
 * return the next date but is not guaranteed to do so. This will fail when
 * the original `serial` points to the last day of a month or a year.
 */
export class DateSerializer {
  // Configuration for serializing dates
  private static readonly yearFactor = 10000;
  private static readonly monthFactor = 100;
  private static readonly dateFactor = 1;

  /**
   * Serialize a date to a number, where each date (year,month,date)
   * is mapped to a different number.
   *
   * @param date Date to serialize
   * @returns    Serial number for date
   */
  static serializeDate(date: Date): number {
    return (
      date.getFullYear() * DateSerializer.yearFactor +
      (date.getMonth() + 1) * DateSerializer.monthFactor +
      date.getDate() * DateSerializer.dateFactor
    );
  }

  /**
   * Deserializes a date to the original date.
   *
   * @param serial Serialized number
   * @returns      Deserialized date
   */
  static deserializeDate(serial: number): Date {
    let remainder = serial;
    const year = Math.floor(remainder / DateSerializer.yearFactor);
    remainder = remainder % DateSerializer.yearFactor;
    const month = Math.floor(remainder / DateSerializer.monthFactor);
    remainder = remainder % DateSerializer.monthFactor;
    const date = Math.floor(remainder / DateSerializer.dateFactor);
    remainder = remainder % DateSerializer.dateFactor;

    const yyyy = year.toString().padStart(4, "0");
    const mm = month.toString().padStart(2, "0");
    const dd = date.toString().padStart(2, "0");

    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  /**
   * Serializes a month to a number.
   *
   * @param date Date whose month is to be serialized.
   * @retuns     Serial corresponding to that month.
   */
  static serializeMonth(date: Date): number {
    return date.getFullYear() * 12 + date.getMonth();
  }

  /**
   * Deserializes a number to a month.
   *
   * @param date Serial of month
   * @retuns     Date corresponding to that month.
   */
  static deserializeMonth(serial: number) {
    const year = Math.floor(serial / 12);
    const month = Math.floor(serial % 12);
    return new Date(year, month);
  }
}
