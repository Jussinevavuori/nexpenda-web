import { useMemo } from "react";
import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { useStoreState } from "../../../store";
import { DataUtils } from "../../../utils/DataUtils/DataUtils";
import { AnalyticsOverviewProps } from "./AnalyticsOverview";

export function useAnalyticsOverviewController(props: AnalyticsOverviewProps) {
  const analytics = useAnalyticsContext();
  const isMonth = useStoreState((_) => _.interval.isMonth);
  const isYear = useStoreState((_) => _.interval.isYear);
  const isAll = useStoreState((_) => _.interval.isAll);

  // Label the interval as either month, year or all. We assume no other
  // options are possible (enforced by other parts of the application.)
  const intervalLengthLabel = useMemo(() => {
    if (isMonth) return "month";
    if (isYear) return "year";
    else return "all";
  }, [isMonth, isYear]);

  // Calculat all percentage increases
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

  // Calculate all properties for the sparkline component
  const sparkLine = useMemo(() => {
    const transactions = analytics.selected.transactions;
    const start = analytics.selectedInterval.start;
    const end = analytics.selectedInterval.end;
    const now = new Date();

    const startMs = start.getTime();
    const endMs = end.getTime();
    const nowMs = now.getTime();

    // Map current time to percentage between 0 % and 100 % representing
    // how far the current date is within the range, where 0 % is
    // at start or before and 100 % is at end or after.
    const intervalProgressPercentage = DataUtils.mapValue(
      nowMs,
      startMs,
      endMs,
      0,
      100,
      { clamp: true }
    );

    // Construct data as cumulative chart per date
    let y = 0;
    let x = startMs;
    let data = [{ x, y, hidden: false }];
    /* eslint-disable no-loop-func */
    for (const transaction of transactions.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )) {
      x = transaction.date.getTime();
      y += transaction.amount.decimalValue;
      data = data.filter((_) => _.x !== x).concat({ x, y, hidden: false });
    }

    // If now is in interval, draw line to now unless later datapoints exist
    if (nowMs > startMs && nowMs < endMs && nowMs > x) {
      data.push({ x: nowMs, y, hidden: false });
    }

    // Final endpoint to stretch data
    data.push({ x: endMs, y, hidden: endMs > nowMs });

    // Final datapoint to stretch the last value until the end

    console.log({ data, intervalProgressPercentage });

    return {
      data,
      intervalProgressPercentage,
    };
  }, [analytics]);

  return {
    sparkLine,
    analytics,
    intervalLengthLabel,
    totalPercentageIncrease,
    incomePercentageIncrease,
    expensesPercentageIncrease,
    isMonth,
    isYear,
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
  const previousSign = previous === 0 ? 0 : previous < 0 ? -1 : 1;

  // If no previous value, automatically display...
  // 0 %    when current value is 0
  // 100 %  when current value is > 0
  // -100 % when current value is < 0
  if (previous === 0) return 100 * currentSign;

  // Return difference between values with correct sign
  return ((100 * (current - previous)) / previous) * previousSign;
}
