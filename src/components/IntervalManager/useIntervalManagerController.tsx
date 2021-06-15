import { useState } from "react"
import { ComponentState } from "../../hooks/componentStates/ComponentState"
import { useBooleanQueryState } from "../../hooks/state/useBooleanQueryState"
import { useStoreActions, useStoreState } from "../../store"
import { IntervalManagerProps } from "./IntervalManager"

export function useIntervalManagerController(props: IntervalManagerProps) {

	const intervalLabel = useStoreState(_ => _.interval.smartDisplayString)
	const includesToday = useStoreState(_ => _.interval.includesToday)

	const handleToday = useStoreActions(_ => _.interval.now)
	const handlePrevious = useStoreActions(_ => _.interval.previousInterval)
	const handleNext = useStoreActions(_ => _.interval.nextInterval)

	const shouldShowControls = props.hideControls !== true

	const [intervalPickerOpen, setIntervalPickerOpen] = useBooleanQueryState(ComponentState.keys.IntervalMenu, "push")
	const [intervalPickerMenuAnchor, setIntervalPickerMenuAnchor] = useState<HTMLElement>()


	return {
		intervalLabel,
		includesToday,
		handleToday: () => handleToday(),
		handlePrevious: () => handlePrevious(),
		handleNext: () => handleNext(),
		shouldShowControls,
		intervalPickerOpen,
		setIntervalPickerOpen,
		intervalPickerMenuAnchor,
		setIntervalPickerMenuAnchor,
	}
}