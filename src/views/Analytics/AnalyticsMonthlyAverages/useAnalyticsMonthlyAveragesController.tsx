import { useMemo, useState } from "react"
import { AnalyticsMonthlyAveragesProps } from "./AnalyticsMonthlyAverages"
import { useAnalyticsContext } from "../../../contexts/AnalyticsContext.context"
import { TimerangeID } from "../../../utils/AnalyticsUtils/Timerange"


export function useAnalyticsMonthlyAveragesController(props: AnalyticsMonthlyAveragesProps) {

	const analytics = useAnalyticsContext()

	const [activeTimerangeId, setActiveTimerangeId] = useState<Exclude<TimerangeID, number>>("thisyear")

	const timeranges = useMemo(() => {
		return [
			analytics.base["active"],
			analytics.base["alltime"],
			analytics.base["last12months"],
			analytics.base["lastyear"],
			analytics.base["thisyear"],
		]
	}, [analytics])

	const activeTimerange = useMemo(() => {
		return analytics.base[activeTimerangeId]
	}, [activeTimerangeId, analytics])

	const activeAverage = useMemo(() => {
		return analytics.base[activeTimerangeId].averageTotal
	}, [activeTimerangeId, analytics])

	return {
		timeranges,
		activeAverage,
		setActiveTimerangeId,
		activeTimerange
	}
}