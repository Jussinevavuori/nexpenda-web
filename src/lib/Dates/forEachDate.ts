import { addDays, startOfDay } from "date-fns";
import { compareDate } from "./compareDate";

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
export function forEachDate(
  from: Date,
  to: Date,
  callback: (date: Date, i: number) => void
) {
  // Get number of days to increment on each loop (1 or -1)
  const daysIncrement = compareDate(from, "<=", to) ? 1 : -1;

  // Get min and max dates
  const min = compareDate(from, "<=", to) ? from : to;
  const max = compareDate(from, "<=", to) ? to : from;

  // Loop and run callback for each date
  let date = from;
  let i = 0;
  while (compareDate(min, "<=", date) && compareDate(date, "<=", max)) {
    callback(date, i);
    date = startOfDay(addDays(date, daysIncrement));
    i++;
  }
}
