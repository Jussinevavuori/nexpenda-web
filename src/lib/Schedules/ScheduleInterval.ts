import * as dateFns from "date-fns";
import { Schedule } from "./Schedule";

export class ScheduleInterval {
  /**
   * How many intervals between each occurrences
   */
  every: JsonSchedule["interval"]["every"];

  /**
   * Type of interval
   */
  type: JsonSchedule["interval"]["type"];

  constructor(json: JsonSchedule["interval"]) {
    this.every = json.every;
    this.type = json.type;
  }

  /**
   * Add intervals to date
   */
  add(date: Date, numIntervals = 1) {
    switch (this.type) {
      case "DAY": {
        return dateFns.addDays(date, numIntervals * this.every);
      }
      case "WEEK": {
        return dateFns.addWeeks(date, numIntervals * this.every);
      }
      case "MONTH": {
        return dateFns.addMonths(date, numIntervals * this.every);
      }
      case "YEAR": {
        return dateFns.addYears(date, numIntervals * this.every);
      }
    }
  }

  getAverageOccurrencesPerYear() {
    switch (this.type) {
      case "DAY": {
        return 365 / this.every;
      }
      case "WEEK": {
        return 365 / (7 * this.every);
      }
      case "MONTH": {
        return 12 / this.every;
      }
      case "YEAR": {
        return 1 / this.every;
      }
    }
  }

  /**
   * Format interval to string. Replaces the "%" character with the schedule
   * string.
   */
  format() {
    const n = this.every;
    const interval = this.type.toLowerCase();
    return n > 1 ? `${n} ${interval}s` : `${interval}`;
  }

  static isValidEveryValue(value: any): value is ScheduleInterval["every"] {
    return Schedule.Schema.shape.interval.shape.every.check(value);
  }

  static isValidTypeValue(value: any): value is ScheduleInterval["type"] {
    return Schedule.Schema.shape.interval.shape.type.check(value);
  }
}
