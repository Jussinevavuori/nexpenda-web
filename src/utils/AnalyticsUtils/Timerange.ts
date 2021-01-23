import {
  differenceInMonths,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
  format,
} from "date-fns";
import { Category } from "../../classes/Category";
import { MAXIMUM_DATE, MINIMUM_DATE } from "../../constants";
import { DateUtils } from "../DateUtils/DateUtils";
import { Total } from "./Total";

export type TimerangeID =
  | number
  | "active"
  | "last12months"
  | "thisyear"
  | "lastyear"
  | "alltime";

export class Timerange {
  public readonly id: TimerangeID;
  public readonly label: string;
  public readonly start: Date;
  public readonly end: Date;

  public readonly total: Total;

  private earliestDate: Date;
  private latestDate: Date;

  public category?: Category;

  constructor(
    timerange: {
      id: TimerangeID;
      label: string;
      start: Date;
      end: Date;
    },
    earliestDate: Date,
    latestDate: Date
  ) {
    this.id = timerange.id;
    this.label = timerange.label;
    this.start = timerange.start;
    this.end = timerange.end;
    this.total = new Total();
    this.earliestDate = earliestDate;
    this.latestDate = latestDate;
  }

  /**
   * Does the timerange include the given date?
   */
  includes(date: Date) {
    return (
      DateUtils.compareDate(date, ">=", this.start) &&
      DateUtils.compareDate(date, "<=", this.end)
    );
  }

  /**
   * Gets the later of the two: earliest date and timerange start
   */
  get limitedStart() {
    return this.earliestDate.getTime() > this.start.getTime()
      ? this.earliestDate
      : this.start;
  }

  /**
   * Gets the earlier of the two: latest date and timerange end
   */
  get limitedEnd() {
    return this.latestDate.getTime() < this.end.getTime()
      ? this.latestDate
      : this.end;
  }

  /**
   * Returns an average total.
   */
  get averageTotal() {
    return this.total.getAverageTotalOver(this.lengthInMonths);
  }

  /**
   * Gets the length of the timerange in months.
   */
  get lengthInMonths() {
    const diff = differenceInMonths(this.limitedEnd, this.limitedStart);
    return Math.floor(Math.max(1, 1 + Math.abs(diff)));
  }

  setCategory(category: Category) {
    this.category = category;
    this.total.setCategory(category);
  }

  /**
   * Creates all timeranges
   *
   * @param earliestDate Earliest possible date
   * @param latestDate Latest possible date
   * @param startDate Start date of the selected interval
   * @param endDate End date of the selected interval
   */
  static createTimeranges(
    earliestDate: Date,
    latestDate: Date,
    startDate: Date,
    endDate: Date
  ) {
    const timeranges = {
      last12months: new Timerange(
        {
          id: "last12months",
          label: "Last 12 months",
          start: startOfMonth(subMonths(new Date(), 11)),
          end: endOfMonth(new Date()),
        },
        earliestDate,
        latestDate
      ),
      thisyear: new Timerange(
        {
          id: "thisyear",
          label: "This year",
          start: startOfYear(new Date()),
          end: endOfYear(new Date()),
        },
        earliestDate,
        latestDate
      ),
      lastyear: new Timerange(
        {
          id: "lastyear",
          label: "Last year",
          start: startOfYear(subYears(new Date(), 1)),
          end: endOfYear(subYears(new Date(), 1)),
        },
        earliestDate,
        latestDate
      ),
      alltime: new Timerange(
        {
          id: "alltime",
          label: "All time",
          start: MINIMUM_DATE,
          end: MAXIMUM_DATE,
        },
        earliestDate,
        latestDate
      ),
      active: new Timerange(
        {
          id: "active",
          label: "Selected range",
          start: startDate,
          end: endDate,
        },
        earliestDate,
        latestDate
      ),
    } as Record<TimerangeID, Timerange>;

    const earliestSerial = DateUtils.serializeMonth(earliestDate);
    const latestSerial = DateUtils.serializeMonth(latestDate);

    for (let i = earliestSerial; i <= latestSerial; i++) {
      const month = DateUtils.deserializeMonth(i);
      timeranges[i] = new Timerange(
        {
          id: i,
          label: format(month, `MMMM y`),
          start: startOfMonth(month),
          end: endOfMonth(month),
        },
        earliestDate,
        latestDate
      );
    }

    return timeranges;
  }
}
