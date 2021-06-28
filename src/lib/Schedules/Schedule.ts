import * as z from "zod";
import * as dateFns from "date-fns";
import { ScheduleInterval } from "./ScheduleInterval";
import { compareDate } from "../Dates/compareDate";

/**
 * A schedule is used to schedule repeating transactions. A schedule contains
 * occurrences. A schedule must define its first occurrence which is the first
 * date when an event or transaction is scheduled to occur. A schedule will also
 * contain an interval, which can be used to deduce all the following
 * occurrences. A schedule may also contain a last occurrence which is used to
 * end a schedule.
 */
export class Schedule {
  /**
   * The repeat interval. Contains information about how often the schedule
   * should occur.
   */
  public readonly interval: ScheduleInterval;

  /**
   * Date of first occurrence.
   */
  public readonly firstOccurrence: Date;

  /**
   * Total number of occurrences.
   */
  public readonly occurrences?: number;

  /**
   * Cache previous occurrence after calculating once. Undefined means not
   * calculated, null means no occurrence. Results are stored by their date
   * indices.
   */
  private previousOccurrenceCache: Record<number, null | Date>;

  /**
   * Cache next occurrence after calculating once. Undefined means not
   * calculated, null means no occurrence. Results are stored by their date
   * indices.
   */
  private nextOccurrenceCache: Record<number, null | Date>;

  /**
   * Last occurrence cache. Null means uninitialized.
   */
  private lastOccurrenceCache: null | undefined | Date;

  /**
   * Do not use the constructor directly as the constructor may throw errors.
   * Use `Schedule.From()` instead to get a result object.
   */
  constructor(json: JsonSchedule) {
    this.firstOccurrence = new Date(json.firstOccurrence);
    this.occurrences = json.occurrences;
    this.previousOccurrenceCache = {};
    this.nextOccurrenceCache = {};
    this.lastOccurrenceCache = null;
    this.interval = new ScheduleInterval({
      type: json.interval.type,
      every: json.interval.every,
    });
  }

  /**
   * Format interval to string. Replaces the "%" character with the schedule
   * string.
   */
  formatInterval() {
    return this.interval.format();
  }

  /**
   * Check if the date is the first occurrence or after it and if a last date
   * exists, is the last date or before it.
   */
  isDateInInterval(date: Date) {
    const last = this.getLastOccurrence();
    return (
      compareDate(this.firstOccurrence, "<=", date) &&
      (!last || compareDate(last, ">=", date))
    );
  }

  /**
   * Check if still active
   */
  getIsActive() {
    const last = this.getLastOccurrence();
    return !last || compareDate(last, ">=", new Date());
  }

  /**
   * Assume occurrence is a valid occurrence and calculate the next occurrence
   * from that occurrence. If the next occurrence is outside the interval,
   * return undefined.
   */
  getNextOccurrenceFrom(occurrence: Date) {
    const next = this.interval.add(occurrence, 1);
    return this.isDateInInterval(next) ? next : undefined;
  }

  /**
   * Assume occurrence is a valid occurrence and calculate the previous
   * occurrence from that occurrence. If the previous occurrence is outside the
   * interval, return undefined.
   */
  getPreviousOccurrenceFrom(occurrence: Date) {
    const prev = this.interval.add(occurrence, -1);
    return this.isDateInInterval(prev) ? prev : undefined;
  }

  /**
   * Get next occurrence from today or from specified date.
   */
  getNextOccurrence(d: Date = new Date()): Date | undefined {
    // Internal function to calculate next occurrence without caching
    const _getNextOccurrence = () => {
      // Get index of first and given date and their diff
      const iFirst = getDateIndex(this.firstOccurrence);
      const iDate = getDateIndex(d);
      const iDiff = iDate - iFirst;

      // Get index of last or infinite
      const last = this.getLastOccurrence();
      const iLast = last ? getDateIndex(last) : Infinity;

      // If date is before first, first is next occurrence
      if (iDiff < 0) {
        return this.firstOccurrence;
      }

      // If last is today or passed, no next occurrence
      else if (iDate >= iLast) {
        return last;
      }

      // For days and weeks, the next can directly be calculated
      else if (this.interval.type === "DAY" || this.interval.type === "WEEK") {
        // Occurs every n days
        const defaultLength = this.interval.type === "WEEK" ? 7 : 1;
        const nDays = defaultLength * this.interval.every;

        // Days since last occurrence
        const daysSinceLast = iDiff % nDays;
        const daysUntilNext = nDays - daysSinceLast;
        return fromDateIndex(iDate + daysUntilNext);
      }

      // By default find next occurrence by looping
      else {
        // Loop until last occurrence or last considered day
        const limit = (last ?? LAST_CONSIDERED_DAY).getTime();

        // Date iterator
        let date = dateFns.startOfDay(this.firstOccurrence);

        // Loop until limit
        while (date.getTime() < limit) {
          // Iterate to next: if jumps outside of interval, return undefined
          // for no found next interval
          const nextDate = this.getNextOccurrenceFrom(date);
          if (!nextDate) {
            return undefined;
          }
          date = nextDate;

          // If new date is in the future, it is the first in the future
          // and is thus the next occurrence
          if (getDateIndex(date) > iDate) {
            return date;
          }
        }

        // In case of none found
        return undefined;
      }
    };
    // Use cached and short-circuit if possible
    const index = getDateIndex(d);
    const cached = this.nextOccurrenceCache[index];
    if (cached || cached === null) {
      return cached ?? undefined;
    }

    // Cache and return
    const result = _getNextOccurrence();
    this.nextOccurrenceCache[index] = result ?? null;
    return result;
  }

  /**
   * Get previous occurrence from today or from specified date.
   */
  getPreviousOccurrence(d: Date = new Date()): Date | undefined {
    // Internal function to calculate previous occurrence without caching
    const _getPreviousOccurrence = () => {
      // Get index of first and given date and their diff
      const iFirst = getDateIndex(this.firstOccurrence);
      const iDate = getDateIndex(d);
      const iDiff = iDate - iFirst;

      // Get index of last or infinite
      const last = this.getLastOccurrence();
      const iLast = last ? getDateIndex(last) : Infinity;

      // If today is before first, no previous occurrence exists
      if (iDiff < 0) {
        return undefined;
      }

      // If last is today or passed, last was previous occurrence
      else if (iDate >= iLast) {
        return last;
      }

      // For days and weeks, the previous can directly be calculated
      else if (this.interval.type === "DAY" || this.interval.type === "WEEK") {
        // Occurs every n days
        const defaultLength = this.interval.type === "WEEK" ? 7 : 1;
        const nDays = defaultLength * this.interval.every;

        // Days since last occurrence
        const daysSinceLast = iDiff % nDays;
        return fromDateIndex(iDate - daysSinceLast);
      }

      // By default find previous occurrence by looping
      else {
        // Loop until last occurrence or last considered day
        const limit = (last ?? LAST_CONSIDERED_DAY).getTime();

        // Record previous date. Start from first occurrence.
        let prev = dateFns.startOfDay(this.firstOccurrence);

        // Loop until limit
        while (prev.getTime() < limit) {
          // Get next occurrence from previous occurrence. In case of next jumping
          // out of interval, use the latest prev date as the previous occurrence
          // if it is in the past or today.
          const next = this.getNextOccurrenceFrom(prev);
          if (!next) {
            if (getDateIndex(prev) <= iDate) {
              return prev;
            } else {
              return undefined;
            }
          }

          // If next is in the future and prev is today or in the past
          // we have found the previous occurrence.
          if (getDateIndex(prev) <= iDate && getDateIndex(next) > iDate) {
            return prev;
          }

          // Else assign next as previous
          prev = next;
        }

        // In case of none found
        return undefined;
      }
    };
    // Use cached and short-circuit if possible
    const index = getDateIndex(d);
    const cached = this.previousOccurrenceCache[index];
    if (cached || cached === null) {
      return cached ?? undefined;
    }

    // Cache and return
    const result = _getPreviousOccurrence();
    this.previousOccurrenceCache[index] = result ?? null;
    return result;
  }

  /**
   * Last occurrence. Returns undefined if there is no last occurrence.
   */
  getLastOccurrence(): Date | undefined {
    // Direct calculation function
    const _getLastOccurrence = () => {
      if (!this.occurrences) return undefined;
      return Schedule.getLastOccurrence({
        firstOccurrence: this.firstOccurrence,
        occurrences: this.occurrences,
        interval: this.interval,
      });
    };

    // Use cache or calculate and cache
    if (this.lastOccurrenceCache === null) {
      const result = _getLastOccurrence();
      this.lastOccurrenceCache = result;
      return result;
    } else {
      return this.lastOccurrenceCache;
    }
  }

  /**
   * Check whether the schedule is still active (last occurrence not passed).
   */
  isActive(): boolean {
    // If no termination date, schedule will never terminate
    const lastOccurrence = this.getLastOccurrence();
    if (!lastOccurrence) {
      return true;
    }

    const today = dateFns.startOfDay(new Date());
    const last = dateFns.startOfDay(lastOccurrence);
    return !dateFns.isAfter(last, today);
  }

  /**
   * Determine the last occurrence when the first occurrence, number of
   * occurrences and the specified interval is known.
   */
  static getLastOccurrence(args: {
    firstOccurrence: Date;
    occurrences: number;
    interval: ScheduleInterval;
  }): Date {
    // Shorthand to first occurrence as first. Ensure first is set to start
    // of day for proper calculations.
    const first = dateFns.startOfDay(args.firstOccurrence);

    // Number of occurrences. Forced to be an integer greater than one by flooring
    // and limiting to 1 at minimum.
    const occurrences = Math.max(1, Math.floor(args.occurrences));

    // Duration in units of time specified by interval
    const duration = args.interval.every * (occurrences - 1);

    // Based on type of interval, add days, weeks, months or years to
    // first date to get correct terminate after date.
    switch (args.interval.type) {
      case "DAY": {
        return dateFns.addDays(first, duration);
      }
      case "WEEK": {
        return dateFns.addWeeks(first, duration);
      }
      case "MONTH": {
        return dateFns.addMonths(first, duration);
      }
      case "YEAR": {
        return dateFns.addYears(first, duration);
      }
    }
  }

  // ===========================================================================
  // SCHEMAS
  // ===========================================================================

  /**
   * Schema
   */
  static Schema = z.object({
    id: z.string().nonempty(),
    firstOccurrence: z
      .number()
      .positive()
      .int()
      .refine((n) => !Number.isNaN(new Date(n).getTime())),
    occurrences: z.number().positive().int().optional(),
    createdAt: z.number().positive().int(),
    interval: z.object({
      type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
      every: z.number().positive().int(),
    }),
  });
}

/**
 * Constant for storing number of milliseconds in a day
 */
const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * Utility function for getting the date's index.
 *
 * What is a date index?
 * The date's index is the number of days between that day and epoch (1.1.1970).
 * Dates' indices have the property, that subsequent days have subsequent indices.
 */
function getDateIndex(date: Date) {
  return Math.floor(date.getTime() / DAY_MS);
}

/**
 * Utility function for getting a date corresponding to a date index.
 *
 * What is a date index?
 * The date's index is the number of days between that day and epoch (1.1.1970).
 * Dates' indices have the property, that subsequent days have subsequent indices.
 */
function fromDateIndex(n: number): Date {
  return new Date(Math.floor(Math.max(n, 0)) * DAY_MS);
}

/**
 * Last considered day is 10 years into the future. All looping algorithms
 * will be terminated after that.
 */
const LAST_CONSIDERED_DAY = dateFns.startOfDay(
  dateFns.addYears(new Date(), 10)
);
