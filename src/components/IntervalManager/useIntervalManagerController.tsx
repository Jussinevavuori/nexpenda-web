import { useIntervalManagerOpenState } from "../../hooks/componentStates/useIntervalManagerOpenState"
import { useStoreActions, useStoreState } from "../../store"
import { IntervalManagerProps } from "./IntervalManager"

export function useIntervalManagerController(props: IntervalManagerProps) {

	const intervalLabel = useStoreState(_ => _.interval.smartDisplayString)
	const includesToday = useStoreState(_ => _.interval.includesToday)

	const handleToday = useStoreActions(_ => _.interval.now)
	const handlePrevious = useStoreActions(_ => _.interval.previousInterval)
	const handleNext = useStoreActions(_ => _.interval.nextInterval)

	const shouldShowControls = props.hideControls !== true

	const menuState = useIntervalManagerOpenState()


	return {
		intervalLabel,
		includesToday,
		handleToday: () => handleToday(),
		handlePrevious: () => handlePrevious(),
		handleNext: () => handleNext(),
		shouldShowControls,
		menuState,
	}
}