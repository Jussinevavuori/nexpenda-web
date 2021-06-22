import * as dateFns from "date-fns";

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
}
