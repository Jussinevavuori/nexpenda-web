import { useMemo } from "react";
import { SparkLineProps } from "../SparkLine/SparkLine";
import { TimeseriesSparkLineProps } from "./TimeseriesSparkLine";
import { TimeseriesSparkLineUtils } from "./TImeseriesSparkLineUtils";

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
    maxPoints,
    ...SparkLineProps
  } = props;

  // Calculate SparkLine's data from props per date.
  const SparkLineData = useMemo((): SparkLineProps["data"] => {
    return TimeseriesSparkLineUtils.getSparklineData({
      data,
      cumulative,
      startDate,
      endDate,
      hideValuesAfter,
      hideValuesBefore,
      maxPoints: maxPoints ?? TimeseriesSparkLinePropsDefaults.MaxPoints,
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
