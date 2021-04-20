import { useMemo } from "react";
import { DateUtils } from "../../utils/DateUtils/DateUtils";
import { SparkLineProps } from "../SparkLine/SparkLine";
import { TimeseriesSparkLineProps } from "./TimeseriesSparkLine";

export function useTimeseriesSparkLineController(
  props: TimeseriesSparkLineProps
) {
  const {
    cumulative,
    data,
    startDate,
    endDate,
    hideValuesAfter,
    hideValuesBefore,
    ...SparkLineProps
  } = props;

  // Calculate SparkLine's data from props per date.
  const SparkLineData = useMemo((): SparkLineProps["data"] => {
    // Parse dates to all data items
    const _data = data.map((item) => {
      const d = item.time instanceof Date ? item.time : new Date(item.time);
      return {
        date: d,
        timestamp: d.valueOf(),
        value: item.value,
      };
    });

    // Get date range for all data (min and max date)
    const dateRange = DateUtils.datesToDateRange(_data.map((_) => _.date));

    // Initialize cumulative value counter
    let cumulativeValue = 0;

    // Map each date to a value (cumulative if specified on props)
    // as the sum of all values for that date.
    const values = DateUtils.mapEachDate(
      startDate ?? dateRange.min,
      endDate ?? dateRange.max,
      (date) => {
        // Get all data points for the date and sum of their values
        const dateData = _data.filter((item) =>
          DateUtils.compareDate(item.date, "==", date)
        );
        const dateValue = dateData.reduce((sum, item) => {
          return sum + item.value;
        }, 0);

        // Count cumulative value
        cumulativeValue += dateValue;

        // Return either cumulative or regular value
        return {
          date,
          value: cumulative ? cumulativeValue : dateValue,
          hidden:
            (hideValuesAfter &&
              DateUtils.compareDate(date, ">", hideValuesAfter)) ||
            (hideValuesBefore &&
              DateUtils.compareDate(date, "<", hideValuesBefore)),
        };
      }
    );

    return values.map((value) => {
      return {
        x: value.date.getTime(),
        y: value.value,
        hidden: value.hidden,
      };
    });
  }, [data, cumulative, startDate, endDate, hideValuesAfter, hideValuesBefore]);

  return {
    SparkLineData,
    SparkLineProps,
  };
}
