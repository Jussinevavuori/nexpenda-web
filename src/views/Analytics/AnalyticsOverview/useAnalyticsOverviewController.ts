import { useMemo } from "react";
import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { useStoreState } from "../../../store";
import { AnalyticsOverviewProps } from "./AnalyticsOverview";

export function useAnalyticsOverviewController(props: AnalyticsOverviewProps) {
  const analytics = useAnalyticsContext();

  const isMonth = useStoreState((_) => _.interval.isMonth);
  const isYear = useStoreState((_) => _.interval.isYear);
  const isAll = useStoreState((_) => _.interval.isAll);

  const intervalLengthLabel = useMemo(() => {
    if (isMonth) return "month";
    if (isYear) return "year";
    else return "all";
  }, [isMonth, isYear]);

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

  return {
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
