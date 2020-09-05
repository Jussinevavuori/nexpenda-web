import React from "react"
import { TransactionListFiltersView } from "./TransactionListFiltersView"
import { useStoreActions } from "../../store"

export type TransactionListFiltersProps = {

}

export function TransactionListFilters(props: TransactionListFiltersProps) {

	const setNextMonthAsDateInterval = useStoreActions(_ => _.interval.setNextMonthAsDateInterval)
	const setPreviousMonthAsDateInterval = useStoreActions(_ => _.interval.setPreviousMonthAsDateInterval)

	function handleNextMonth() {
		setNextMonthAsDateInterval()
	}

	function handlePreviousMonth() {
		setPreviousMonthAsDateInterval()
	}

	return <TransactionListFiltersView
		onNextMonth={handleNextMonth}
		onPreviousMonth={handlePreviousMonth}
	/>
}