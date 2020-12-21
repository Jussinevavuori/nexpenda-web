import { useStoreState } from "../../../store";

export function useAnalyticsHeaderController() {
	const intervalLabel = useStoreState(_ => _.interval.smartDisplayString)

	return {
		intervalLabel
	}
}