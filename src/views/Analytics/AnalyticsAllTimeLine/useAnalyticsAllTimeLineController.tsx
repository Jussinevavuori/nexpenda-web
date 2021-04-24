import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context";
import { DateSerializer } from "../../../utils/DateUtils/DateSerializer";
import { AnalyticsAllTimeLineProps } from "./AnalyticsAllTimeLine"

export function useAnalyticsAllTimeLineController(props: AnalyticsAllTimeLineProps) {

	const analytics = useAnalyticsContext()

	const data: { x: number, y: number }[] =
		Object.values(analytics.allTime.months)
			.sort((a, b) => a.key - b.key)
			.map((month) => ({ x: month.key, y: month.cumulativeTotal }))

	const labelOffset = Object.values(analytics.allTime.months)
		.reduce((min, next) => next.key < min ? next.key : min, Infinity)

	const total = analytics.allTime.total.total

	return {
		data,
		labelOffset,
		total,
		serializeMonth: DateSerializer.serializeMonth,
		deserializeMonth: DateSerializer.deserializeMonth,
	}
}