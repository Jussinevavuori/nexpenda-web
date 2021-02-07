import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { AnalyticsAverageTotalsProps } from "./AnalyticsAverageTotals";

export function useAnalyticsAverageTotalsController(
  props: AnalyticsAverageTotalsProps
) {
  const ctx = useAnalyticsContext();

  return {
    totals: ctx.pastYear.total,
  };
}
