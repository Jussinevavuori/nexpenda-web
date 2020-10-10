import React from "react"
import { FiltersFormView } from "./FiltersFormView"
import { useStoreActions, useStoreState } from "../../store"

export type FiltersFormProps = {

	onConfirm?(): void;

}

export function FiltersForm(props: FiltersFormProps) {


	const categories = useStoreState(_ => _.transactions.categories)

	const resetAllFilters = useStoreActions(_ => _.filters.resetAll)
	const resetSearchTermFilter = useStoreActions(_ => _.filters.resetSearchTerm)
	const resetAmountFilter = useStoreActions(_ => _.filters.resetAmount)
	const resetCategoriesFilter = useStoreActions(_ => _.filters.resetCategories)

	const searchTermFilter = useStoreState(_ => _.filters.searchTerm)
	const minAmountFilter = useStoreState(_ => _.filters.minAmount)
	const maxAmountFilter = useStoreState(_ => _.filters.maxAmount)
	const categoriesFilter = useStoreState(_ => _.filters.categories)

	const setSearchTermFilter = useStoreActions(_ => _.filters.setSearchTerm)
	const setAmountFilter = useStoreActions(_ => _.filters.setAmount)
	const selectCategoryFilter = useStoreActions(_ => _.filters.selectCategory)
	const deselectCategoryFilter = useStoreActions(_ => _.filters.deselectCategory)

	const minPossibleAmount = useStoreState(_ => _.transactions.minimumAmount).value
	const maxPossibleAmount = useStoreState(_ => _.transactions.maximumAmount).value

	return <FiltersFormView

		onConfirm={props.onConfirm}

		categories={categories}

		onResetAll={() => {
			resetAllFilters()
			if (props.onConfirm) {
				props.onConfirm()
			}
		}}

		onResetSearchTermFilter={() => resetSearchTermFilter()}
		onResetAmountFilter={() => resetAmountFilter()}
		onResetCategoriesFilter={() => resetCategoriesFilter()}

		searchTermFilter={searchTermFilter}
		minAmountFilter={minAmountFilter}
		maxAmountFilter={maxAmountFilter}
		categoriesFilter={categoriesFilter}

		setSearchTermFilter={value => setSearchTermFilter(value)}
		setAmountFilter={value => setAmountFilter(value)}
		selectCategoryFilter={value => selectCategoryFilter(value)}
		deselectCategoryFilter={value => deselectCategoryFilter(value)}

		minPossibleAmount={Math.min(minPossibleAmount, -1000 * 100)}
		maxPossibleAmount={Math.max(maxPossibleAmount, 1000 * 100)}

	/>
}