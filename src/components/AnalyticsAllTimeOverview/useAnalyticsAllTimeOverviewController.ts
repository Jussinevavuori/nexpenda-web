import { useMemo } from "react";
import { useAnalyticsContext } from "../../contexts/AnalyticsContext.context";
import { useStoreState } from "../../store";
import { TimeseriesSparkLineProps } from "../TimeseriesSparkLine/TimeseriesSparkLine";
import { AnalyticsAllTimeOverviewProps } from "./AnalyticsAllTimeOverview";

export function useAnalyticsAllTimeOverviewController(
  props: AnalyticsAllTimeOverviewProps
) {
  const analytics = useAnalyticsContext();
  const transactions = useStoreState((_) => _.transactions.items);

  // Calculate timeseries sparkline props: provide data, interval and hide
  // required values.
  const timeseriesSparklineProps = useMemo((): Pick<
    TimeseriesSparkLineProps,
    "data" | "startDate" | "endDate" | "hideValuesAfter" | "hideValuesBefore"
  > => {
    return {
      data: transactions.map((transaction) => ({
        time: transaction.date,
        value: transaction.amount.decimalValue,
      })),
    };
  }, [transactions]);

  return {
    analytics,
    timeseriesSparklineProps,
  };
}
