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
    if (options.data.length === 0) {
      return [
        { x: 0, y: 1, hidden: true },
        { x: 0, y: -1, hidden: true },
        { x: 0, y: 0, hidden: true },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ];
    }

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
     * Get date range (min and max date) from data
     */
    const dateRange = DateUtils.datesToDateRange(data.map((_) => _.date));

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
          hidden:
            (options.hideValuesAfter &&
              DateUtils.compareDate(date, ">", options.hideValuesAfter)) ||
            (options.hideValuesBefore &&
              DateUtils.compareDate(date, "<", options.hideValuesBefore)),
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
     */
    return values.map((value) => {
      return {
        x: value.date.getTime(),
        y: value.value,
        hidden: value.hidden,
      };
    });
  }
}
