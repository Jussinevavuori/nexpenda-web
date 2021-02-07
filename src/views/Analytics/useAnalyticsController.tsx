import { useStoreState } from "../../store"
import { AnalyticsProps } from "./Analytics"

export function useAnalyticsController(props: AnalyticsProps) {
	const intervalLabel = useStoreState(_ => _.interval.smartDisplayString)

	return {
		intervalLabel,
	}
}