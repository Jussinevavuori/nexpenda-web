import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { DateUtils } from "../../../utils/DateUtils/DateUtils";
import { AnalyticsAllTimeColumnsProps } from "./AnalyticsAllTimeColumns";

export function useAnalyticsAllTimeColumnsController(
  props: AnalyticsAllTimeColumnsProps
) {
  const analytics = useAnalyticsContext();

  const data = Object.values(analytics.allTime.months)
    .sort((a, b) => a.key - b.key)
    .map((month) => ({
      name: month.key,
      Total: month.total,
      Incomes: month.incomes,
      Expenses: month.expenses,
      Cumulative: month.cumulativeTotal,
    }));

  const labelOffset = Object.values(analytics.allTime.months).reduce(
    (min, next) => (next.key < min ? next.key : min),
    Infinity
  );

  return {
    data,
    labelOffset,
    serializeMonth: DateUtils.serializeMonth,
    deserializeMonth: DateUtils.deserializeMonth,
  };
}
