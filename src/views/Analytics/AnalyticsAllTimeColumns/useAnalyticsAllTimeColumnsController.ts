import { useState } from "react";
import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { DateSerializer } from "../../../lib/Dates/DateSerializer";
import { AnalyticsAllTimeColumnsProps } from "./AnalyticsAllTimeColumns";

export function useAnalyticsAllTimeColumnsController(
  props: AnalyticsAllTimeColumnsProps
) {
  const analytics = useAnalyticsContext();

  const [isShowingTotal, setIsShowingTotal] = useState(false);

  const data = Object.values(analytics.allTime.months)
    .sort((a, b) => a.key - b.key)
    .map((month) => ({
      name: month.key,
      Total: month.total,
      Incomes: month.incomes,
      Expenses: month.expenses,
      Cumulative: month.cumulativeTotal,
    }));

  const scale = {
    max: data.map((_) => _.Incomes).reduce((max, _) => (max > _ ? max : _), 0),
    min: data.map((_) => _.Expenses).reduce((min, _) => (min < _ ? min : _), 0),
  };

  const labelOffset = Object.values(analytics.allTime.months).reduce(
    (min, next) => (next.key < min ? next.key : min),
    Infinity
  );

  return {
    data,
    scale,
    labelOffset,
    isShowingTotal,
    setIsShowingTotal,
    serializeMonth: DateSerializer.serializeMonth,
    deserializeMonth: DateSerializer.deserializeMonth,
  };
}
