import { Action, action, Computed, computed } from "easy-peasy";
import * as datefns from "date-fns";
import { MINIMUM_DATE, MAXIMUM_DATE } from "../constants";
import { DateUtils } from "../utils/DateUtils/DateUtils";

export type IntervalModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

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

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  /**
   * Is the current date interval a signle day
   */
  // isDay: Computed<IntervalModel, boolean>;

  /**
   * Is the current date interval a single full week
   */
  // isWeek: Computed<IntervalModel, boolean>;

  /**
   * Is the current date interval a single full month
   */
  isMonth: Computed<IntervalModel, boolean>;

  /**
   * Is the current date interval a single full year
   */
  isYear: Computed<IntervalModel, boolean>;

  /**
   * Are all selected ("infinite interval")
   */
  isAll: Computed<IntervalModel, boolean>;

  /**
   * Interval length in days
   */
  length: Computed<IntervalModel, number>;

  /**
   * Does the current period include today
   */
  includesToday: Computed<IntervalModel, boolean>;

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

  //==============================================================//
  // ACTIONS
  //==============================================================//

  /**
   * Action to manually specify the start date filter
   */
  // setStartDate: Action<IntervalModel, Date>;

  /**
   * Action to manually specify the end date filter
   */
  // setEndDate: Action<IntervalModel, Date>;

  /**
   * Action to manually specify start and end dates for interval simultaneously
   */
  // setInterval: Action<IntervalModel, { startDate: Date; endDate: Date }>;

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
   * Move interval to nearest day
   */
  // dayInterval: Action<IntervalModel, void>;

  /**
   * Move interval to nearest week
   */
  // weekInterval: Action<IntervalModel, void>;

  /**
   * Move interval to nearest month
   */
  monthInterval: Action<IntervalModel, void>;

  /**
   * Move interval to nearest year
   */
  yearInterval: Action<IntervalModel, void>;

  /**
   * Select all (infinite interval)
   */
  allInterval: Action<IntervalModel, void>;

  /**
   * Return the interval to the current day / week / month / year
   * / custom interval depending on which one it currently is
   */
  now: Action<IntervalModel, void>;
};

export const intervalModel: IntervalModel = {
  //==============================================================//
  // PROPERTIES
  //==============================================================//

  startDate: datefns.startOfMonth(new Date()),

  endDate: datefns.endOfMonth(new Date()),

  //==============================================================//
  // COMPUTED PROPERTIES
  //==============================================================//

  length: computed((state) => {
    return datefns.differenceInDays(state.startDate, state.endDate);
  }),

  isAll: computed((state) => {
    return (
      DateUtils.compareDate(state.startDate, "==", MINIMUM_DATE) &&
      DateUtils.compareDate(state.endDate, "==", MAXIMUM_DATE)
    );
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

  // isWeek: computed((state) => {
  //   return (
  //     datefns.isSameWeek(state.startDate, state.endDate, { weekStartsOn: 1 }) &&
  //     datefns.getDay(state.startDate) === 1 &&
  //     datefns.getDay(state.endDate) === 0
  //   );
  // }),

  // isDay: computed((state) => {
  //   return datefns.isSameDay(state.startDate, state.endDate);
  // }),

  includesToday: computed((state) => {
    const today = new Date();
    return (
      DateUtils.compareDate(today, ">=", state.startDate) &&
      DateUtils.compareDate(today, "<=", state.endDate)
    );
  }),

  smartDisplayString: computed((state) => {
    if (state.isAll) {
      return "All";
    } else if (state.isYear) {
      return datefns.format(state.startDate, "yyyy");
    } else if (state.isMonth) {
      return datefns.format(state.startDate, "MMMM, yyyy");
      // } else if (state.isDay) {
      //   return datefns.format(state.startDate, "d.M.yyyy");
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

  //==============================================================//
  // ACTIONS
  //==============================================================//

  // setStartDate: action((state, date) => {
  //   if (DateUtils.compareDate(date, ">", state.endDate)) {
  //     throw new Error("Start date cannot be after end date");
  //   } else {
  //     state.startDate = date;
  //   }
  // }),

  // setEndDate: action((state, date) => {
  //   if (DateUtils.compareDate(date, "<", state.startDate)) {
  //     throw new Error("End date cannot be before start date");
  //   } else {
  //     state.endDate = date;
  //   }
  // }),

  // setInterval: action((state, dates) => {
  //   if (DateUtils.compareDate(dates.startDate, ">", dates.endDate)) {
  //     throw new Error("End date cannot be before start date");
  //   } else {
  //     state.startDate = dates.startDate;
  //     state.endDate = dates.endDate;
  //   }
  // }),

  nextInterval: action((state) => {
    if (state.isAll) return;
    const newStartDate = datefns.addDays(state.endDate, 1);
    if (state.isYear) {
      state.endDate = datefns.endOfYear(newStartDate);
    } else if (state.isMonth) {
      state.endDate = datefns.endOfMonth(newStartDate);
      // } else if (state.isWeek) {
      //   state.endDate = datefns.endOfWeek(newStartDate, { weekStartsOn: 1 });
    } else {
      state.endDate = datefns.addDays(newStartDate, state.length);
    }
    state.startDate = newStartDate;
  }),

  previousInterval: action((state) => {
    if (state.isAll) return;
    const newEndDate = datefns.subDays(state.startDate, 1);
    if (state.isYear) {
      state.startDate = datefns.startOfYear(newEndDate);
    } else if (state.isMonth) {
      state.startDate = datefns.startOfMonth(newEndDate);
      // } else if (state.isWeek) {
      //   state.startDate = datefns.startOfWeek(newEndDate, { weekStartsOn: 1 });
    } else {
      state.startDate = datefns.subDays(newEndDate, state.length);
    }
    state.endDate = newEndDate;
  }),

  // dayInterval: action((state) => {
  //   const date = state.isAll ? new Date() : state.startDate;
  //   state.startDate = datefns.startOfDay(date);
  //   state.endDate = datefns.endOfDay(date);
  // }),

  // weekInterval: action((state) => {
  //   const date = state.isAll ? new Date() : state.startDate;
  //   state.startDate = datefns.startOfWeek(date, { weekStartsOn: 1 });
  //   state.endDate = datefns.endOfWeek(date, { weekStartsOn: 1 });
  // }),

  monthInterval: action((state) => {
    const date = state.isAll ? new Date() : state.startDate;
    state.startDate = datefns.startOfMonth(date);
    state.endDate = datefns.endOfMonth(date);
  }),

  yearInterval: action((state) => {
    const date = state.isAll ? new Date() : state.startDate;
    state.startDate = datefns.startOfYear(date);
    state.endDate = datefns.endOfYear(date);
  }),

  allInterval: action((state) => {
    state.startDate = MINIMUM_DATE;
    state.endDate = MAXIMUM_DATE;
  }),

  now: action((state) => {
    const today = new Date();
    if (state.isAll) {
      return;
    } else if (state.isYear) {
      state.startDate = datefns.startOfYear(today);
      state.endDate = datefns.endOfYear(today);
    } else if (state.isMonth) {
      state.startDate = datefns.startOfMonth(today);
      state.endDate = datefns.endOfMonth(today);
      // } else if (state.isWeek) {
      //   state.startDate = datefns.startOfWeek(today, { weekStartsOn: 1 });
      //   state.endDate = datefns.endOfWeek(today, { weekStartsOn: 1 });
      // } else if (state.isDay) {
      //   state.startDate = datefns.startOfDay(today);
      //   state.endDate = datefns.endOfDay(today);
    } else {
      state.endDate = datefns.endOfDay(datefns.addDays(today, state.length));
      state.startDate = datefns.startOfDay(today);
    }
  }),
};
