import React from "react"
import { FiltersFormView } from "./FiltersFormView"
import { useStoreActions, useStoreState } from "../../store"

export type FiltersFormProps = {

	onConfirm?(): void;

}

export function FiltersForm(props: FiltersFormProps) {

	const resetAllFilters = useStoreActions(_ => _.filters.resetAll)
	const resetSearchTermFilter = useStoreActions(_ => _.filters.resetSearchTerm)
	const resetAmountFilter = useStoreActions(_ => _.filters.resetAmount)

	const searchTermFilter = useStoreState(_ => _.filters.searchTerm)
	const minAmountFilter = useStoreState(_ => _.filters.minAmount)
	const maxAmountFilter = useStoreState(_ => _.filters.maxAmount)

	const setSearchTermFilter = useStoreActions(_ => _.filters.setSearchTerm)
	const setAmountFilter = useStoreActions(_ => _.filters.setAmount)

	const minPossibleAmount = useStoreState(_ => _.transactions.minimumAmount).value
	const maxPossibleAmount = useStoreState(_ => _.transactions.maximumAmount).value

	return <FiltersFormView

		onConfirm={props.onConfirm}

		onResetAll={() => {
			resetAllFilters()
			if (props.onConfirm) {
				props.onConfirm()
			}
		}}

		onResetSearchTermFilter={() => resetSearchTermFilter()}
		onResetAmountFilter={() => resetAmountFilter()}

		searchTermFilter={searchTermFilter}
		minAmountFilter={minAmountFilter}
		maxAmountFilter={maxAmountFilter}

		setSearchTermFilter={value => setSearchTermFilter(value)}
		setAmountFilter={value => setAmountFilter(value)}

		minPossibleAmount={Math.min(minPossibleAmount, -1000 * 100)}
		maxPossibleAmount={Math.max(maxPossibleAmount, 1000 * 100)}

	/>
}