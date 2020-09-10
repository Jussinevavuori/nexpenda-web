import React from "react"
import { TransactionListFiltersView } from "./TransactionListFiltersView"
import { useStoreActions, useStoreState } from "../../store"

export type TransactionListFiltersProps = {

}

export function TransactionListFilters(props: TransactionListFiltersProps) {

	const nextInterval = useStoreActions(_ => _.interval.nextInterval)
	const previousInterval = useStoreActions(_ => _.interval.previousInterval)

	const weekInterval = useStoreActions(_ => _.interval.weekInterval)
	const monthInterval = useStoreActions(_ => _.interval.monthInterval)
	const yearInterval = useStoreActions(_ => _.interval.yearInterval)

	const startDate = useStoreState(_ => _.interval.startDate)
	const endDate = useStoreState(_ => _.interval.endDate)
	const isYear = useStoreState(_ => _.interval.isYear)
	const isMonth = useStoreState(_ => _.interval.isMonth)
	const isWeek = useStoreState(_ => _.interval.isWeek)
	const displayString = useStoreState(_ => _.interval.displayString)

	return <TransactionListFiltersView
		onNextInterval={() => nextInterval()}
		onPreviousInterval={() => previousInterval()}
		onWeekInterval={() => weekInterval()}
		onMonthInterval={() => monthInterval()}
		onYearInterval={() => yearInterval()}
		startDate={startDate}
		endDate={endDate}
		isYear={isYear}
		isMonth={isMonth}
		isWeek={isWeek}
		intervalString={displayString}
	/>
}