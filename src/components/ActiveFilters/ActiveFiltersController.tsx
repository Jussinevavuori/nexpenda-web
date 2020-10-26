import React, { useMemo } from "react"
import { useStoreActions, useStoreState } from "../../store"
import { ActiveFiltersView } from "./ActiveFiltersView"

export type ActiveFiltersProps = {

}

export function ActiveFilters(props: ActiveFiltersProps) {

	const searchTermFilter = useStoreState(_ => _.filters.searchTerm)
	const categoryFilter = useStoreState(_ => _.filters.categories)
	const minAmountFilter = useStoreState(_ => _.filters.minAmount)
	const maxAmountFilter = useStoreState(_ => _.filters.maxAmount)

	const resetSearchTermFilter = useStoreActions(_ => _.filters.resetSearchTerm)
	const resetCategoryFilter = useStoreActions(_ => _.filters.resetCategories)
	const resetAmountFilter = useStoreActions(_ => _.filters.resetAmount)
	const resetAllFilters = useStoreActions(_ => _.filters.resetAll)

	const minPossibleAmount = useStoreState(_ => _.transactions.minimumAmount)
	const maxPossibleAmount = useStoreState(_ => _.transactions.maximumAmount)

	const searchTermFilterActive = useMemo(() => searchTermFilter.length > 0, [searchTermFilter])
	const categoryFilterActive = useMemo(() => categoryFilter.length > 0, [categoryFilter])
	const minAmountFilterActive = useMemo(() => minAmountFilter > minPossibleAmount.value, [minAmountFilter, minPossibleAmount])
	const maxAmountFilterActive = useMemo(() => maxAmountFilter < maxPossibleAmount.value, [maxAmountFilter, maxPossibleAmount])

	return <ActiveFiltersView

		searchTermFilter={searchTermFilter}
		categoryFilter={categoryFilter}
		minAmountFilter={minAmountFilter}
		maxAmountFilter={maxAmountFilter}

		searchTermFilterActive={searchTermFilterActive}
		categoryFilterActive={categoryFilterActive}
		minAmountFilterActive={minAmountFilterActive}
		maxAmountFilterActive={maxAmountFilterActive}

		onResetSearchTermFilter={() => resetSearchTermFilter()}
		onResetCategoryFilter={() => resetCategoryFilter()}
		onResetAmountFilter={() => resetAmountFilter()}
		onResetAllFilters={() => resetAllFilters()}

	/>
}