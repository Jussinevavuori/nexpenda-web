import { useStoreState, useStoreActions } from "../../store"
import { IntervalPickerFormProps } from "./IntervalPickerForm"

export function useIntervalPickerFormController(props: IntervalPickerFormProps) {

	const intervalString = useStoreState(_ => _.interval.smartDisplayString)

	// const isDay = useStoreState(_ => _.interval.isDay)
	// const isWeek = useStoreState(_ => _.interval.isWeek)
	const isMonth = useStoreState(_ => _.interval.isMonth)
	const isYear = useStoreState(_ => _.interval.isYear)
	const isAll = useStoreState(_ => _.interval.isAll)

	// const toDay = useStoreActions(_ => _.interval.dayInterval)
	// const toWeek = useStoreActions(_ => _.interval.weekInterval)
	const toMonth = useStoreActions(_ => _.interval.monthInterval)
	const toYear = useStoreActions(_ => _.interval.yearInterval)
	const toAll = useStoreActions(_ => _.interval.allInterval)

	const previous = useStoreActions(_ => _.interval.previousInterval)
	const next = useStoreActions(_ => _.interval.nextInterval)

	const now = useStoreActions(_ => _.interval.now)

	const includesToday = useStoreState(_ => _.interval.includesToday)

	const startDate = useStoreState(_ => _.interval.startDate)
	const endDate = useStoreState(_ => _.interval.endDate)

	// const setStartDate = useStoreActions(_ => _.interval.setStartDate)
	// const setEndDate = useStoreActions(_ => _.interval.setEndDate)

	return {

		onConfirm: props.onConfirm,

		intervalString: intervalString,

		// isDay: isDay,
		// isWeek: isWeek,
		isMonth: isMonth,
		isYear: isYear,
		isAll: isAll,

		// onDay: () => toDay(),
		// onWeek: () => toWeek(),
		onMonth: () => toMonth(),
		onYear: () => toYear(),
		onAll: () => toAll(),

		onPrevious: () => previous(),
		onNext: () => next(),

		onNow: () => now(),

		includesToday: includesToday,

		startDate: startDate,
		endDate: endDate,
		// setStartDate: setStartDate,
		// setEndDate: setEndDate,

	}
}