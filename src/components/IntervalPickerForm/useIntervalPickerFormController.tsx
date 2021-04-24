import { useDisabledIntervalLengths } from "../../hooks/application/useDisabledIntervalLengths"
import { useStoreState, useStoreActions } from "../../store"
import { IntervalPickerFormProps } from "./IntervalPickerForm"

export function useIntervalPickerFormController(props: IntervalPickerFormProps) {

	const intervalString = useStoreState(_ => _.interval.smartDisplayString)

	const isMonth = useStoreState(_ => _.interval.isMonth)
	const isYear = useStoreState(_ => _.interval.isYear)
	const isAll = useStoreState(_ => _.interval.isAll)

	const startDate = useStoreState(_ => _.interval.startDate)
	const endDate = useStoreState(_ => _.interval.endDate)

	const includesToday = useStoreState(_ => _.interval.includesToday)

	const toMonth = useStoreActions(_ => _.interval.monthInterval)
	const toYear = useStoreActions(_ => _.interval.yearInterval)
	const toAll = useStoreActions(_ => _.interval.allInterval)

	const previous = useStoreActions(_ => _.interval.previousInterval)
	const next = useStoreActions(_ => _.interval.nextInterval)

	const now = useStoreActions(_ => _.interval.now)


	const disabledIntervalLengths = useDisabledIntervalLengths()

	return {

		onConfirm: props.onConfirm,

		intervalString: intervalString,

		isMonth: isMonth,
		isYear: isYear,
		isAll: isAll,

		onMonth: () => toMonth(),
		onYear: () => toYear(),
		onAll: () => toAll(),

		onPrevious: () => previous(),
		onNext: () => next(),

		onNow: () => now(),

		includesToday: includesToday,

		startDate: startDate,
		endDate: endDate,

		isMonthDisabled: disabledIntervalLengths.includes("month"),
		isYearDisabled: disabledIntervalLengths.includes("year"),
		isAllDisabled: disabledIntervalLengths.includes("all"),

	}
}