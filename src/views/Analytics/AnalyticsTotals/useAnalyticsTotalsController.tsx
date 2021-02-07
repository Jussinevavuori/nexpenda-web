import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context"
import { AnalyticsTotalsProps } from "./AnalyticsTotals"

export function useAnalyticsTotalsController(props: AnalyticsTotalsProps) {
	const analytics = useAnalyticsContext()

	return {
		totals: analytics.selected.total
	}
}