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
   * Move interval forward
   *
   * - If interval is year, select next year
   * - If interval is month, select next month
   * - If interval is week, select next week
   * - If interval is other, select next interval of same length
   *   starting from the end date of the current interval.
   */
  nextInterval: Action<IntervalModel, void>;

  /**
   * Move interval backwards
   *
   * - If interval is year, select previous year
   * - If interval is month, select previous month
   * - If interval is week, select previous week
   * - If interval is other, select previous interval of same length
   *   ending at the starting date of the current interval.
   */
  previousInterval: Action<IntervalModel, void>;

  /**
   * Move interval to nearest week
   */
  weekInterval: Action<IntervalModel, void>;

  /**
   * Move interval to nearest month
   */
  monthInterval: Action<IntervalModel, void>;

  /**
   * Move interval to nearest year
   */
  yearInterval: Action<IntervalModel, void>;

  /**
   * Is the urrent date interval a signle full week
   */
  isWeek: Computed<IntervalModel, boolean>;

  /**
   * Is the current date interval a single full month
   */
  isMonth: Computed<IntervalModel, boolean>;

  /**
   * Is the current date interval a single full year
   */
  isYear: Computed<IntervalModel, boolean>;

  /**
   * Smarter display string that displays in format...
   *
   * - `MMMM, yyyy` (e.g. `July, 1999`) when `isMonth` is `true`
   * - `MMMM, yyyy` (e.g. `July, 1999`) when `isMonth` is `true`
   *
   * Else falls back to `displayString` property and the
   * `d.M. - d.M.yyyy` or `d.M.yyyy - d.M.yyyy` format.
   */
  smartDisplayString: Computed<IntervalModel, string>;

  /**
   * Display string of format
   *
   * `d.M. - d.M.yyyy` or `d.M.yyyy - d.M.yyyy` if dates
   * are in different years.
   *
   * For example
   * - `1.12. - 7.12.2020`
   * - `30.12.1999 - 5.1.2000`
   */
  displayString: Computed<IntervalModel, string>;
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

  nextInterval: action((state) => {
    const length = datefns.differenceInDays(state.startDate, state.endDate);
    const newStartDate = datefns.addDays(state.endDate, 1);
    if (state.isYear) {
      state.endDate = datefns.endOfYear(newStartDate);
    } else if (state.isMonth) {
      state.endDate = datefns.endOfMonth(newStartDate);
    } else if (state.isWeek) {
      state.endDate = datefns.endOfWeek(newStartDate, { weekStartsOn: 1 });
    } else {
      state.endDate = datefns.addDays(newStartDate, length);
    }
    state.startDate = newStartDate;
  }),

  previousInterval: action((state) => {
    const length = datefns.differenceInDays(state.startDate, state.endDate);
    const newEndDate = datefns.subDays(state.startDate, 1);
    if (state.isYear) {
      state.startDate = datefns.startOfYear(newEndDate);
    } else if (state.isMonth) {
      state.startDate = datefns.startOfMonth(newEndDate);
    } else if (state.isWeek) {
      state.startDate = datefns.startOfWeek(newEndDate, { weekStartsOn: 1 });
    } else {
      state.startDate = datefns.subDays(newEndDate, length);
    }
    state.endDate = newEndDate;
  }),

  weekInterval: action((state) => {
    state.startDate = datefns.startOfWeek(state.startDate, { weekStartsOn: 1 });
    state.endDate = datefns.endOfWeek(state.startDate, { weekStartsOn: 1 });
  }),

  monthInterval: action((state) => {
    state.startDate = datefns.startOfMonth(state.startDate);
    state.endDate = datefns.endOfMonth(state.startDate);
  }),

  yearInterval: action((state) => {
    state.startDate = datefns.startOfYear(state.startDate);
    state.endDate = datefns.endOfYear(state.startDate);
  }),

  isYear: computed((state) => {
    return (
      datefns.isSameYear(state.startDate, state.endDate) &&
      datefns.getDayOfYear(state.startDate) === 1 &&
      datefns.isSameDay(state.endDate, datefns.lastDayOfYear(state.endDate))
    );
  }),

  isMonth: computed((state) => {
    return (
      datefns.isSameMonth(state.startDate, state.endDate) &&
      datefns.isFirstDayOfMonth(state.startDate) &&
      datefns.isLastDayOfMonth(state.endDate)
    );
  }),

  isWeek: computed((state) => {
    return (
      datefns.isSameWeek(state.startDate, state.endDate, { weekStartsOn: 1 }) &&
      datefns.getDay(state.startDate) === 1 &&
      datefns.getDay(state.endDate) === 0
    );
  }),

  smartDisplayString: computed((state) => {
    if (state.isYear) {
      return datefns.format(state.startDate, "yyyy");
    } else if (state.isMonth) {
      return datefns.format(state.startDate, "MMMM, yyyy");
    } else {
      return state.displayString;
    }
  }),

  displayString: computed((state) => {
    return (
      (datefns.isSameYear(state.startDate, state.endDate)
        ? datefns.format(state.startDate, "d.M")
        : datefns.format(state.startDate, "d.M.yyyy")) +
      " - " +
      datefns.format(state.endDate, "d.M.yyyy")
    );
  }),
};
