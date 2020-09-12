import React from "react"
import { FiltersFormView } from "./FiltersFormView"
import { useStoreActions, useStoreState } from "../../store"

export type FiltersFormProps = {

	onConfirm?(): void;

}

export function FiltersForm(props: FiltersFormProps) {

	const resetAll = useStoreActions(_ => _.filters.resetAll)

	const resetSearchTerm = useStoreActions(_ => _.filters.resetSearchTerm)
	const resetAmount = useStoreActions(_ => _.filters.resetAmount)
	const resetExcludedCategories = useStoreActions(_ => _.filters.resetExcludedCategories)

	const categories = useStoreState(_ => _.transactions.categories)

	const searchTerm = useStoreState(_ => _.filters.searchTerm)
	const minAmount = useStoreState(_ => _.filters.minAmount)
	const maxAmount = useStoreState(_ => _.filters.maxAmount)
	const excludedCategories = useStoreState(_ => _.filters.excludedCategories)

	const setSearchTerm = useStoreActions(_ => _.filters.setSearchTerm)
	const setAmount = useStoreActions(_ => _.filters.setAmount)
	const excludeCategory = useStoreActions(_ => _.filters.excludeCategory)
	const includeCategory = useStoreActions(_ => _.filters.includeCategory)

	const minPossibleAmount = useStoreState(_ => _.transactions.minimumAmount).value
	const maxPossibleAmount = useStoreState(_ => _.transactions.maximumAmount).value

	return <FiltersFormView

		onConfirm={props.onConfirm}

		onResetAll={() => {
			resetAll()
			if (props.onConfirm) props.onConfirm()
		}}

		onResetSearchTerm={() => resetSearchTerm()}
		onResetAmount={() => resetAmount()}
		onResetExcludedCategories={() => resetExcludedCategories()}

		categories={categories}

		searchTerm={searchTerm}
		minAmount={minAmount}
		maxAmount={maxAmount}
		excludedCategories={excludedCategories}

		setSearchTerm={value => setSearchTerm(value)}
		setAmount={value => setAmount(value)}
		excludeCategory={value => excludeCategory(value)}
		includeCategory={value => includeCategory(value)}

		minPossibleAmount={minPossibleAmount}
		maxPossibleAmount={maxPossibleAmount}

	/>
}