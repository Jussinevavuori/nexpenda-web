import { DateSerializer } from "../../utils/DateUtils/DateSerializer";
import { DateUtils } from "../../utils/DateUtils/DateUtils";
import { SparkLineProps } from "../SparkLine/SparkLine";
import { TimeseriesSparkLineProps } from "./TimeseriesSparkLine";

export class TimeseriesSparkLineUtils {
  /**
   * Maps timeseries sparkline data (formatted as datapoints that have a date
   * and a value) into x,y-points readable by the SparkLine component.
   */
  static getSparklineData(options: {
    data: TimeseriesSparkLineProps["data"];
    cumulative: TimeseriesSparkLineProps["cumulative"];
    startDate: TimeseriesSparkLineProps["startDate"];
    endDate: TimeseriesSparkLineProps["endDate"];
    hideValuesAfter: TimeseriesSparkLineProps["hideValuesAfter"];
    hideValuesBefore: TimeseriesSparkLineProps["hideValuesBefore"];
    maxPoints: NonNullable<TimeseriesSparkLineProps["maxPoints"]>;
  }): SparkLineProps["data"] {
    /**
     * Map data to easier usable items
     */
    const data = options.data.map((item) => {
      const d = item.time instanceof Date ? item.time : new Date(item.time);
      return {
        date: d,
        timestamp: d.valueOf(),
        value: item.value,
      };
    });

    /**
     * Group data by date serial for performance
     */
    const groupedData = DateUtils.groupByDateSerialToMap(data, (t) => t.date);

    /**
     * Get date range (min and max date) from data. If empty date, use
     * placeholder values of 1 and 2
     */
    const dateRange =
      data.length > 0
        ? DateUtils.datesToDateRange(data.map((_) => _.date))
        : { min: new Date(1), max: new Date(2) };

    /**
     * Initialize cumulative value counter from 0
     */
    let cumulativeValue = 0;

    /**
     * Map each date to a value (cumulative if specified on props)
     * as the sum of all values for that date.
     */
    let values = DateUtils.mapEachDate(
      options.startDate ?? dateRange.min,
      options.endDate ?? dateRange.max,
      (date, i) => {
        // Get all data points for the date and sum of their values
        const dateData = groupedData[DateSerializer.serializeDate(date)] ?? [];
        const dateValue = dateData.reduce((sum, item) => sum + item.value, 0);

        // Cumulative value
        cumulativeValue += dateValue;

        return {
          date,

          // Use the date's own value or cumulative value depending on the
          // options.
          value: options.cumulative ? cumulativeValue : dateValue,

          // Hide if `hideValuesAfter` or `hideValuesBefore` provided and the
          // date matches either of those.
          hidden: Boolean(
            (options.hideValuesAfter &&
              DateUtils.compareDate(date, ">", options.hideValuesAfter)) ||
              (options.hideValuesBefore &&
                DateUtils.compareDate(date, "<", options.hideValuesBefore))
          ),
        };
      }
    );

    /**
     * Reduce number of points by averaging two consecutive points to a single
     * point, effectively halving the number of points on each run until the
     * number of points becomes less than the specified `maxPoints`
     */
    while (values.length > options.maxPoints) {
      const newValues: typeof values = [];

      for (let i = 0; i < values.length; i += 2) {
        const a = values[i];
        const b = values[i + 1];

        if (a && b) {
          newValues.push({
            date: a.date,
            value: (a.value + b.value) / 2,
            hidden: a.hidden || b.hidden,
          });
        } else if (a) {
          newValues.push(a);
        }
      }

      values = newValues;
    }

    /**
     * Return the values as specified in the props of SparkLine.
     * Also add additional padding to correct ends, starts and arrays with
     * 0 or 1 items.
     */
    return [
      // Add hidden (0, 1), (0, -1) and (0, 0) points to data at beginning
      // in order to draw zerolines at correct height.
      { x: dateRange.min.getTime(), y: 1, hidden: true },
      { x: dateRange.min.getTime(), y: -1, hidden: true },
      { x: dateRange.min.getTime(), y: 0, hidden: true },

      // Add real data
      ...values.map((value) => {
        return {
          x: value.date.getTime(),
          y: value.value,
          hidden: value.hidden,
        };
      }),

      // Draw to end
      { x: dateRange.max.getTime(), y: values[values.length - 1]?.value ?? 0 },
    ];
  }
}
