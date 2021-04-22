import { useEffect, useMemo, useState } from "react"
import { useRouteData } from "../../hooks/application/useRouteData"
import { useHashOpenState } from "../../hooks/state/useHashOpenState"
import { ALL_VALID_INTERVAL_LENGTH_TYPES, ValidIntervalLengthType } from "../../models/interval.model"
import { useStoreActions, useStoreState } from "../../store"
import { IntervalManagerProps } from "./IntervalManager"

export function useIntervalManagerController(props: IntervalManagerProps) {

	const intervalLabel = useStoreState(_ => _.interval.smartDisplayString)
	const includesToday = useStoreState(_ => _.interval.includesToday)

	const intervalLengthType = useStoreState(_ => _.interval.lengthType)
	const routeData = useRouteData()
	const forcedIntervalLength = routeData?.forcedIntervalLength
	const disabledIntervalLengths = routeData?.disabledIntervalLengths

	const handleToday = useStoreActions(_ => _.interval.now)
	const handlePrevious = useStoreActions(_ => _.interval.previousInterval)
	const handleNext = useStoreActions(_ => _.interval.nextInterval)

	const toMonth = useStoreActions(_ => _.interval.monthInterval)
	const toYear = useStoreActions(_ => _.interval.yearInterval)
	const toAll = useStoreActions(_ => _.interval.allInterval)

	const shouldShowControls = props.hideControls !== true

	const [intervalPickerOpen, setIntervalPickerOpen] = useHashOpenState("interval")
	const [intervalPickerMenuAnchor, setIntervalPickerMenuAnchor] = useState<HTMLElement>()


	/**
	 * If the length is invalid, set to month
	 * 
	 * If the length is forced and the current lenght type is not the forced
	 * length, set the length to the forced length.
	 * 
	 * If the current length is included in the list of disabled lengths, find
	 * any length not in that list and switch
	 */
	useEffect(function forceIntervalLengthType() {
		let targetLength: ValidIntervalLengthType | undefined;

		// Find any valid length type
		const anyValidLengthType = forcedIntervalLength
			?? ALL_VALID_INTERVAL_LENGTH_TYPES
				.find(_ => !(disabledIntervalLengths ?? []).includes(_))
			?? "month"

		if (intervalLengthType === "invalid") {
			// Handle invalid length by forcing any valid length
			targetLength = anyValidLengthType

		} else if (forcedIntervalLength && forcedIntervalLength !== intervalLengthType) {
			// Handle forced interval length by forcing that length
			targetLength = forcedIntervalLength;

		} else if (disabledIntervalLengths && disabledIntervalLengths.includes(intervalLengthType)) {
			// Handle disabled lengths by forcing any valid length
			targetLength = anyValidLengthType
		}

		// Switch length to specified length if any specified
		if (targetLength) {
			switch (targetLength) {
				case "month": toMonth(); break;
				case "year": toYear(); break;
				case "all": toAll(); break;
			}
		}
	}, [forcedIntervalLength, disabledIntervalLengths, intervalLengthType, toMonth, toYear, toAll])

	/**
	 * List of all length types that are disabled based on the forced and disabled
	 * length types.
	 */
	const disabledIntervalLengthTypes = useMemo(() => {
		let _disabled: ValidIntervalLengthType[] = []
		if (forcedIntervalLength) {
			_disabled.push(...ALL_VALID_INTERVAL_LENGTH_TYPES.filter(_ => _ !== forcedIntervalLength))
		}
		if (disabledIntervalLengths) {
			_disabled.push(...disabledIntervalLengths)
		}
		return _disabled
	}, [forcedIntervalLength, disabledIntervalLengths])

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
		disabledIntervalLengthTypes,
	}
}