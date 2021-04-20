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
    maxPoints: propsMaxPoints,
    ...SparkLineProps
  } = props;

  const maxPoints =
    propsMaxPoints ?? TimeseriesSparkLinePropsDefaults.MaxPoints;

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
    let values = DateUtils.mapEachDate(
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

    // Reduce number of points by averaging point values until
    // there are few enough points
    while (values.length > maxPoints) {
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

    return values.map((value) => {
      return {
        x: value.date.getTime(),
        y: value.value,
        hidden: value.hidden,
      };
    });
  }, [
    data,
    cumulative,
    startDate,
    endDate,
    hideValuesAfter,
    hideValuesBefore,
    maxPoints,
  ]);

  return {
    SparkLineData,
    SparkLineProps,
  };
}

export const TimeseriesSparkLinePropsDefaults = {
  MaxPoints: 200,
};
