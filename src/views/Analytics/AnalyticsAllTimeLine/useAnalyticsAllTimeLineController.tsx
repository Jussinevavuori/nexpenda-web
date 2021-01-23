import { useMemo } from "react";
import { useStoreState } from "../../../store"
import { calculateAnalyticsMonthlyCumulative } from "../../../utils/AnalyticsUtils/calculateAnalyticsMonthlyCumulative";
import { AnalyticsAllTimeLineProps } from "./AnalyticsAllTimeLine"

export function useAnalyticsAllTimeLineController(props: AnalyticsAllTimeLineProps) {

	const transactions = useStoreState(_ => _.transactions.items)

	const { data, firstMonth: labelOffset, total, serializeMonth, deserializeMonth } = useMemo(() => {
		return calculateAnalyticsMonthlyCumulative(transactions)
	}, [transactions])

	return { data, labelOffset, total, serializeMonth, deserializeMonth }
}