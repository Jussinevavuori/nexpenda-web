import { Action, action, Computed, computed } from "easy-peasy";
import * as datefns from "date-fns";
import { compareDate } from "../../utils/compareDate";

export type TransactionIntervalModel = {
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
  setStartDate: Action<TransactionIntervalModel, Date>;

  /**
   * Action to manually specify the end date filter
   */
  setEndDate: Action<TransactionIntervalModel, Date>;

  /**
   * Automatically set the date filter interval to the specified month
   */
  setMonthAsDateInterval: Action<
    TransactionIntervalModel,
    { year: number; month: number }
  >;

  /**
   * Set previous month as interval. Uses the start date's month to figure
   * out the previous month in case the start and end date are in different
   * months.
   */
  setPreviousMonthAsDateInterval: Action<TransactionIntervalModel, void>;

  /**
   * Set next month as interval. Uses the end date's month to figure out
   * the next month in case the start and end date are in different months.
   */
  setNextMonthAsDateInterval: Action<TransactionIntervalModel, void>;

  /**
   * Is the current date interval a single full month
   */
  dateIntervalIsMonth: Computed<TransactionIntervalModel, boolean>;

  /**
   * The current date interval month string or undefined if date interval is not a
   * single full month
   */
  dateIntervalMonthString: Computed<
    TransactionIntervalModel,
    string | undefined
  >;
};

export const transactionIntervalModel: TransactionIntervalModel = {
  // Interval properties
  startDate: datefns.startOfMonth(new Date()),
  endDate: datefns.endOfMonth(new Date()),

  // Interval setters
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

  // Interval higher level setters
  setMonthAsDateInterval: action((state, payload) => {
    const startOfMonth = new Date(
      `${payload.year}-${payload.month.toFixed(0).padStart(2, "0")}-01`
    );
    state.startDate = startOfMonth;
    state.endDate = datefns.endOfMonth(startOfMonth);
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

  // Interval computed properties
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
