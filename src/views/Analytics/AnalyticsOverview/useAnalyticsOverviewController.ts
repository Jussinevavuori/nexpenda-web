import { useMemo } from "react";
import { TimeseriesSparkLineProps } from "../../../components/TimeseriesSparkLine/TimeseriesSparkLine";
import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { useStoreState } from "../../../store";
import { DateUtils } from "../../../utils/DateUtils/DateUtils";
import { AnalyticsOverviewProps } from "./AnalyticsOverview";

export function useAnalyticsOverviewController(props: AnalyticsOverviewProps) {
  const analytics = useAnalyticsContext();
  const intervalLengthLabel = useStoreState((_) => _.interval.lengthType);
  const allTransactions = useStoreState((_) => _.transactions.items);
  const isSelectedIntervalAll = useStoreState((_) => _.interval.isAll);
  const isAll = isSelectedIntervalAll || props.interval === "allTime";

  // Calculate all percentage increases
  const totalPercentageIncrease = getPercentageIncrease(
    analytics.previous.total.total,
    analytics.selected.total.total
  );
  const incomePercentageIncrease = getPercentageIncrease(
    analytics.previous.total.incomes,
    analytics.selected.total.incomes
  );
  const expensesPercentageIncrease = getPercentageIncrease(
    analytics.previous.total.expenses,
    analytics.selected.total.expenses
  );

  // All absolute values
  const totalTotal = isAll
    ? analytics.allTime.total.total
    : analytics.selected.total.total;
  const incomesTotal = isAll
    ? analytics.allTime.total.incomes
    : analytics.selected.total.incomes;
  const expensesTotal = isAll
    ? analytics.allTime.total.expenses
    : analytics.selected.total.expenses;

  // Calculate timeseries sparkline props: provide data, interval and hide
  // required values.
  const timeseriesSparklineProps = useMemo((): Pick<
    TimeseriesSparkLineProps,
    "data" | "startDate" | "endDate" | "hideValuesAfter" | "hideValuesBefore"
  > => {
    // Fix performance issues
    if (isAll) {
      return {
        data: allTransactions.map((transaction) => ({
          time: transaction.date,
          value: transaction.amount.decimalValue,
        })),
      };
    }

    const selectedTransactions = analytics.selected.transactions;
    const startDate = analytics.selectedInterval.start;
    const endDate = analytics.selectedInterval.end;
    const currentDate = new Date();

    const isCurrentDateWithinInterval =
      DateUtils.compareDate(currentDate, ">=", startDate) &&
      DateUtils.compareDate(currentDate, "<", endDate);

    return {
      data: selectedTransactions.map((transaction) => ({
        time: transaction.date,
        value: transaction.amount.decimalValue,
      })),
      startDate,
      endDate,
      hideValuesBefore: undefined,
      hideValuesAfter: isCurrentDateWithinInterval ? currentDate : undefined,
    };
  }, [analytics, isAll, allTransactions]);

  return {
    intervalLengthLabel: isAll ? "all" : intervalLengthLabel,
    totalPercentageIncrease,
    incomePercentageIncrease,
    expensesPercentageIncrease,
    timeseriesSparklineProps,
    totalTotal,
    incomesTotal,
    expensesTotal,
    isAll,
  };
}

/**
 * Get the percentage that the current value has risen when compared to
 * the previous value.
 *
 * @param previous 	Previous value
 * @param current 	Current value
 * @returns 				Increase as percentage
 */
function getPercentageIncrease(previous: number, current: number) {
  const currentSign = current === 0 ? 0 : current < 0 ? -1 : 1;
  // const previousSign = previous === 0 ? 0 : previous < 0 ? -1 : 1;

  // If no previous value, automatically display...
  // 0 %    when current value is 0
  // 100 %  when current value is > 0
  // -100 % when current value is < 0
  if (previous === 0) return 100 * currentSign;

  // Return difference between values with correct sign
  return (100 * (current - previous)) / previous;
}
