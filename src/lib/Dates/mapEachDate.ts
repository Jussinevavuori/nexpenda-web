import { forEachDate } from "./forEachDate";

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
export function mapEachDate<T>(
  from: Date,
  to: Date,
  callback: (date: Date, i: number) => T
) {
  const result: T[] = [];
  forEachDate(from, to, (date, i) => result.push(callback(date, i)));
  return result;
}
