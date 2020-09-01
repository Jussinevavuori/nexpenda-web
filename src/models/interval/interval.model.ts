import { Action, action, Computed, computed } from "easy-peasy";
import * as datefns from "date-fns";
import { compareDate } from "../../utils/compareDate";

export type IntervalModel = {
  /**
   * Date filter start limit.
   *
   * All transactions with the same or later date will pass this filter.
   * The time of day is not taken into account while comparing dates.
   *
   * Defaults to start date of current month.
   */
  startDate: Date;

  /**
   * Date filter end limit.
   *
   * All transactions with the same or earlier date will pass this filter.
   * The time of day is not taken into account while comparing dates.
   *
   * Defaults to end date of current month.
   */
  endDate: Date;

  /**
   * Action to manually specify the start date filter
   */
  setStartDate: Action<IntervalModel, Date>;

  /**
   * Action to manually specify the end date filter
   */
  setEndDate: Action<IntervalModel, Date>;

  /**
   * Action to manually specify start and end dates for interval simultaneously
   */
  setInterval: Action<IntervalModel, { startDate: Date; endDate: Date }>;

  /**
   * Set previous month as interval. Uses the start date's month to figure
   * out the previous month in case the start and end date are in different
   * months.
   */
  setPreviousMonthAsDateInterval: Action<IntervalModel, void>;

  /**
   * Set next month as interval. Uses the end date's month to figure out
   * the next month in case the start and end date are in different months.
   */
  setNextMonthAsDateInterval: Action<IntervalModel, void>;

  /**
   * Is the current date interval a single full month
   */
  dateIntervalIsMonth: Computed<IntervalModel, boolean>;

  /**
   * The current date interval month string or undefined if date interval is not a
   * single full month
   */
  dateIntervalMonthString: Computed<IntervalModel, string | undefined>;
};

export const intervalModel: IntervalModel = {
  startDate: datefns.startOfMonth(new Date()),

  endDate: datefns.endOfMonth(new Date()),

  setStartDate: action((state, date) => {
    if (compareDate(date, ">", state.endDate)) {
      throw new Error("Start date cannot be after end date");
    } else {
      state.startDate = date;
    }
  }),

  setEndDate: action((state, date) => {
    if (compareDate(date, "<", state.startDate)) {
      throw new Error("End date cannot be before start date");
    } else {
      state.endDate = date;
    }
  }),

  setInterval: action((state, dates) => {
    if (compareDate(dates.startDate, ">", dates.endDate)) {
      throw new Error("End date cannot be before start date");
    } else {
      state.startDate = dates.startDate;
      state.endDate = dates.endDate;
    }
  }),

  setPreviousMonthAsDateInterval: action((state) => {
    const startOfActiveMonth = datefns.startOfMonth(state.startDate);
    const dateInPreviousMonth = datefns.subDays(startOfActiveMonth, 1);
    state.startDate = datefns.startOfMonth(dateInPreviousMonth);
    state.endDate = datefns.endOfMonth(dateInPreviousMonth);
  }),

  setNextMonthAsDateInterval: action((state) => {
    const endOfActiveMonth = datefns.endOfMonth(state.endDate);
    const dateInNextMonth = datefns.addDays(endOfActiveMonth, 1);
    state.startDate = datefns.startOfMonth(dateInNextMonth);
    state.endDate = datefns.endOfMonth(dateInNextMonth);
  }),

  dateIntervalIsMonth: computed((state) => {
    return (
      datefns.isSameMonth(state.startDate, state.endDate) &&
      datefns.isFirstDayOfMonth(state.startDate) &&
      datefns.isLastDayOfMonth(state.endDate)
    );
  }),

  dateIntervalMonthString: computed((state) => {
    if (state.dateIntervalIsMonth) {
      const month = state.startDate.toLocaleDateString("en-EN", {
        month: "long",
      });
      const year = state.startDate.toLocaleDateString("en-EN", {
        year: "numeric",
      });
      return `${month}, ${year}`;
    }
  }),
};
